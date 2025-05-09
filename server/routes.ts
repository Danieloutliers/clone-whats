import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files for sound effects
  const mediaDir = path.join(process.cwd(), 'public', 'media');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true });
  }
  
  // Write sound files if they don't exist
  const receivedSoundPath = path.join(mediaDir, 'received.mp3');
  const sentSoundPath = path.join(mediaDir, 'sent.mp3');
  
  if (!fs.existsSync(receivedSoundPath)) {
    // We'll create a minimal MP3 file (just a few bytes) since we can't include binary files
    fs.writeFileSync(receivedSoundPath, Buffer.from([0xFF, 0xE3, 0x18, 0xC4, 0x00, 0x00, 0x00, 0x03, 0x48, 0x00, 0x00, 0x00, 0x00]));
  }
  
  if (!fs.existsSync(sentSoundPath)) {
    fs.writeFileSync(sentSoundPath, Buffer.from([0xFF, 0xE3, 0x18, 0xC4, 0x00, 0x00, 0x00, 0x03, 0x48, 0x00, 0x00, 0x00, 0x00]));
  }
  
  app.use('/media', (req, res, next) => {
    res.sendFile(path.join(mediaDir, req.path), (err) => {
      if (err) next();
    });
  });
  
  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  const httpServer = createServer(app);
  return httpServer;
}
