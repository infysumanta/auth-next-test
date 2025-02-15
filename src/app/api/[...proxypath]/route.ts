import { getServerSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const PROXY_BASE_URL = "https://dummyjson.com";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ proxypath: string[] }> },
) {
  try {
    const proxypath = (await params).proxypath;
    const path = proxypath.join("/");
    const url = `${PROXY_BASE_URL}/${path}`;
    const session = await getServerSession();
    if (session) {
      const accessToken = session.accessToken;
      const refreshToken = session.refreshToken;

      if (accessToken) {
        request.headers.set("Authorization", `Bearer ${accessToken}`);
      }

      if (refreshToken) {
        request.headers.set("Refresh-Token", refreshToken);
      }
    }

    const response = await fetch(url, {
      headers: request.headers,
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Proxy GET error:`, error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ proxypath: string[] }> },
) {
  try {
    const proxypath = (await params).proxypath;
    const path = proxypath.join("/");
    const url = `${PROXY_BASE_URL}/${path}`;
    const session = await getServerSession();
    if (session) {
      const accessToken = session.accessToken;
      const refreshToken = session.refreshToken;

      if (accessToken) {
        request.headers.set("Authorization", `Bearer ${accessToken}`);
      }

      if (refreshToken) {
        request.headers.set("Refresh-Token", refreshToken);
      }
    }
    const response = await fetch(url, {
      method: "POST",
      headers: request.headers,
      body: request.body,
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Proxy POST error:`, error);
    return NextResponse.json({ error: "Failed to post data" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ proxypath: string[] }> },
) {
  try {
    const proxypath = (await params).proxypath;
    const path = proxypath.join("/");
    const url = `${PROXY_BASE_URL}/${path}`;
    const session = await getServerSession();
    if (session) {
      const accessToken = session.accessToken;
      const refreshToken = session.refreshToken;

      if (accessToken) {
        request.headers.set("Authorization", `Bearer ${accessToken}`);
      }

      if (refreshToken) {
        request.headers.set("Refresh-Token", refreshToken);
      }
    }
    const response = await fetch(url, {
      method: "PUT",
      headers: request.headers,
      body: request.body,
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Proxy PUT error:`, error);
    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ proxypath: string[] }> },
) {
  try {
    const proxypath = (await params).proxypath;
    const path = proxypath.join("/");
    const url = `${PROXY_BASE_URL}/${path}`;
    const session = await getServerSession();
    if (session) {
      const accessToken = session.accessToken;
      const refreshToken = session.refreshToken;

      if (accessToken) {
        request.headers.set("Authorization", `Bearer ${accessToken}`);
      }

      if (refreshToken) {
        request.headers.set("Refresh-Token", refreshToken);
      }
    }
    const response = await fetch(url, {
      method: "DELETE",
      headers: request.headers,
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Proxy DELETE error:`, error);
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 },
    );
  }
}
