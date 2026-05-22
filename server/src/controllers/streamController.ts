import { Request, Response } from "express";

import { extractAudioStream } from "../services/ytStreamService";

export async function streamController(
  req: Request,
  res: Response
) {
  try {
    const id = String(req.params.id);
    const streamUrl =
      await extractAudioStream(id);

    res.json({
      streamUrl,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to extract stream",
    });
  }
}