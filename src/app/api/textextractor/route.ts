import { NextResponse } from "next/server";
import OpenAi from "openai";

export async function POST(request: any) {
  const cookie = await request.headers.get("cookie");
  if (!cookie) {
    // Not Signed in
    const notAuthorized = "You are not authorized no no no";
    return new Response(JSON.stringify(notAuthorized), {
      status: 400,
    });
  }
  const openai = new OpenAi({
    apiKey: process.env.OPEN_AI_KEY,
  });

  const { imageUrl } = await request.json();

  console.log("imageUrl", imageUrl);

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4", // or 'gpt-4' based on your API access
      max_tokens: 4096,
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that extracts text from images and generates an SEO-optimized title and description for a product based on that text.`,
        },
        {
          role: "user",
          content: `Analyze this image: ${imageUrl} and generate a search engine optimized title and description for the product.`,
        },
      ],
    });

    const { content }: any = chatCompletion.choices[0].message;
    console.log("content", content);

    const [title, description] = content
      .split("\n")
      .map((line: string) => line.trim());

    return NextResponse.json(
      {
        message: "Email no verificado",
        title: title,
        description: description,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error analyzing image with OpenAI API:", error);
    return NextResponse.json(
      { message: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
