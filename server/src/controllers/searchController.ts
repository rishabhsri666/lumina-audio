import { Request, Response } from "express";

import { searchSongs } from "../services/ytSearchService";

export async function searchController(
  req: Request,
  res: Response
) {
  try {
    const query = req.query.q as string;

    if (!query) {
      return res.status(400).json({
        error: "Missing query",
      });
    }

    const results = await searchSongs(query);

    res.json(results);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Search failed",
    });
  }
}