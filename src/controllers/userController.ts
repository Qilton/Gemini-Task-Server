import { db } from "../db/client";
import { userTable } from "../db/schema";
import { Webhook } from 'svix';
import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import config from "../config/config";

export const emailWebhook = async (req: Request, res: Response) => {
  const WEBHOOK_SECRET = config.emailWebhook!;

  const headers = req.headers;
  const svixId = headers['svix-id'] as string;
  const svixTimestamp = headers['svix-timestamp'] as string;
  const svixSignature = headers['svix-signature'] as string;

  if (!svixId || !svixTimestamp || !svixSignature) {
    return res.status(400).json({ error: 'Missing Svix headers' });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any;

  try {
    evt = wh.verify(JSON.stringify(req.body), {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as any;
  } catch (err) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (evt.type === 'email.created') {
    const { email_address, user_id,username } = evt.data; 

    try {
      const existingUser = await db.query.userTable.findFirst({
        where: eq(userTable.clerkId, user_id),
      });

      if (existingUser) {
        return res.status(200).json({ message: 'User already exists' });
      }

      await db.insert(userTable).values({
        clerkId: user_id,
        email: email_address,
        username: username|| email_address.split('@')[0],
        emailVerified: true,
        profileImageUrl: '', 
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`Created user for email: ${email_address}`);
      return res.status(201).json({ success: true });
    } catch (error) {
      console.error('Database operation failed:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.status(200).json({ received: true });
};