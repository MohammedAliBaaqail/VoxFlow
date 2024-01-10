import { DeepgramError, createClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY ?? "");
export async function GET(request) {
  // gotta use the request object to invalidate the cache every request :vomit:
  const url = request.url;

  let { result: projectsResult, error: projectsError } =
    await deepgram.manage.getProjects();

  if (projectsError) {
    return NextResponse.json(projectsError);
  }

  const project = projectsResult?.projects[0];

  if (!project) {
    return NextResponse.json(
      new DeepgramError(
        "Cannot find a Deepgram project. Please create a project first."
      )
    );
  }

  let { result, error } = await deepgram.manage.createProjectKey(project.project_id, {
      comment: "Temporary API key",
      scopes: ["usage:write"],
      tags: ["next.js"],
      time_to_live_in_seconds: 100,
    });

  if (error) {
    return NextResponse.json(error);
  }

  return NextResponse.json({ ...result, url });
}

export async function POST(request) {
  try {
   

    const { url } = req.body;
    console.log(url);
    const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
      {
        url,
      },
      {
        smart_format: true,
        model: "nova-2",
      }
    );

    if (error) throw error;

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}