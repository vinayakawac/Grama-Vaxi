import 'server-only'

import { adminDb, messaging } from '@/lib/firebase/admin'

interface NotificationTokenRecord {
  uid: string
  token: string
}

interface CampDispatchInput {
  campId: string
  village: string
  date: Date
  time: string
  location: string
  message?: string
}

export interface CampDispatchResult {
  dispatchStatus: 'SENT' | 'PARTIAL' | 'NO_RECIPIENTS' | 'SKIPPED_DISABLED'
  deliveredCount: number
  failedCount: number
}

function chunkArray<T>(items: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize))
  }
  return chunks
}

export async function dispatchCampAlert(
  input: CampDispatchInput
): Promise<CampDispatchResult> {
  const campRef = adminDb.collection('camps').doc(input.campId)

  const configSnap = await adminDb.doc('config/notifications').get()
  const campAlertsEnabled =
    (configSnap.data() as { campAlertsEnabled?: boolean } | undefined)
      ?.campAlertsEnabled ?? true

  if (!campAlertsEnabled) {
    await campRef.set(
      {
        dispatchStatus: 'SKIPPED_DISABLED',
        deliveredCount: 0,
        failedCount: 0,
        dispatchedAt: new Date(),
      },
      { merge: true }
    )

    return {
      dispatchStatus: 'SKIPPED_DISABLED',
      deliveredCount: 0,
      failedCount: 0,
    }
  }

  const tokenSnap = await adminDb
    .collection('notificationTokens')
    .where('enabled', '==', true)
    .where('village', '==', input.village)
    .get()

  const tokenDocs = tokenSnap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as NotificationTokenRecord),
  }))

  if (!tokenDocs.length) {
    await campRef.set(
      {
        dispatchStatus: 'NO_RECIPIENTS',
        deliveredCount: 0,
        failedCount: 0,
        dispatchedAt: new Date(),
      },
      { merge: true }
    )

    return {
      dispatchStatus: 'NO_RECIPIENTS',
      deliveredCount: 0,
      failedCount: 0,
    }
  }

  const title = 'Camp Alert - Grama-Vaxi'
  const normalizedDate = input.date.toISOString().slice(0, 10)
  const bodyText =
    input.message?.trim() ||
    `Doctor arriving at ${input.village} on ${normalizedDate} at ${input.time}`

  let successCount = 0
  let failureCount = 0
  const invalidTokenDocIds: string[] = []

  const tokens = tokenDocs.map((doc) => doc.token)
  for (const tokenChunk of chunkArray(tokens, 500)) {
    const response = await messaging.sendEachForMulticast({
      tokens: tokenChunk,
      notification: {
        title,
        body: bodyText,
      },
      data: {
        type: 'CAMP_ALERT',
        campId: input.campId,
        village: input.village,
        date: normalizedDate,
        time: input.time,
      },
      android: {
        priority: 'high',
        notification: {
          channelId: 'camp_alerts',
        },
      },
    })

    successCount += response.successCount
    failureCount += response.failureCount

    response.responses.forEach((item, index) => {
      if (item.success) return
      const code = item.error?.code
      if (
        code === 'messaging/registration-token-not-registered' ||
        code === 'messaging/invalid-registration-token'
      ) {
        const token = tokenChunk[index]
        const tokenDoc = tokenDocs.find((doc) => doc.token === token)
        if (tokenDoc) {
          invalidTokenDocIds.push(tokenDoc.id)
        }
      }
    })
  }

  if (invalidTokenDocIds.length) {
    const cleanupBatch = adminDb.batch()
    invalidTokenDocIds.forEach((id) => {
      cleanupBatch.set(
        adminDb.collection('notificationTokens').doc(id),
        {
          enabled: false,
          updatedAt: new Date(),
          lastError: 'TOKEN_INVALID',
        },
        { merge: true }
      )
    })
    await cleanupBatch.commit()
  }

  const uniqueUids = Array.from(new Set(tokenDocs.map((doc) => doc.uid)))
  for (const uidChunk of chunkArray(uniqueUids, 400)) {
    const alertBatch = adminDb.batch()
    uidChunk.forEach((uid) => {
      const ref = adminDb.collection('alerts').doc()
      alertBatch.set(ref, {
        ownerUid: uid,
        title,
        message: bodyText,
        level: 'INFO',
        isRead: false,
        village: input.village,
        campId: input.campId,
        campDate: normalizedDate,
        campTime: input.time,
        campLocation: input.location,
        createdAt: new Date(),
      })
    })
    await alertBatch.commit()
  }

  const dispatchStatus = failureCount > 0 ? 'PARTIAL' : 'SENT'

  await campRef.set(
    {
      dispatchStatus,
      deliveredCount: successCount,
      failedCount: failureCount,
      dispatchedAt: new Date(),
    },
    { merge: true }
  )

  return {
    dispatchStatus,
    deliveredCount: successCount,
    failedCount: failureCount,
  }
}
