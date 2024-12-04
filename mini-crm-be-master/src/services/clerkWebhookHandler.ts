import { UserJSON, WebhookEvent, WebhookEventType } from '@clerk/express';
import { Request, Response } from 'express';
import { Webhook } from 'svix';

export default async function (req: Request, res: Response) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error('You need a WEBHOOK_SECRET in your .env');
  }

  // Get the headers and body
  const headers = req.headers;
  const payload = req.body;

  // Get the Svix headers for verification
  const svix_id = headers['svix-id'] as string | undefined;
  const svix_timestamp = headers['svix-timestamp'] as string | undefined;
  const svix_signature = headers['svix-signature'] as string | undefined;

  // If there are no Svix headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ message: 'Error occurred -- no svix headers' });
  }

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt:WebhookEvent;

  // Attempt to verify the incoming webhook
  // If successful, the payload will be available from 'evt'
  // If the verification fails, error out and return error code
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.log('Error verifying webhook:', (err as Error).message);
    return res.status(400).json({
      success: false,
      message: (err as Error).message,
    });
  }
  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data as UserJSON;
  const eventType = evt.type as WebhookEventType;
  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
  console.log('Webhook body:', evt.data);

  if(eventType === 'user.created') {
    // TODO: Add user handlers
  }
  else if(eventType === 'user.updated') {
    // TODO: Add user handlers
  }
  else if(eventType === 'user.deleted') {
    // TODO: Add user handlers
  }

  return res.status(200).json({
    success: true,
    message: 'Webhook received',
  });
}