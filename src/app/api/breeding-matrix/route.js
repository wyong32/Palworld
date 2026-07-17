import { breedingMatrix } from "@/data/breedingMatrix";

export function GET() {
  return Response.json(breedingMatrix, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
