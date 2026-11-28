/**
 * Vercel Edge Routing Middleware (zero dependencies, standard Web Request/Response)
 * Ensures requests to https://tutors.beaconbridgeacademics.co.uk/ receive the
 * dedicated prerendered /tutor-waitlist/index.html (with unique SEO title, description,
 * canonical URL, and OpenGraph preview image) BEFORE static dist/index.html is served.
 */
export default function middleware(request) {
  const url = new URL(request.url);
  const host = (request.headers.get('host') || url.hostname || '').toLowerCase();

  if (host === 'tutors.beaconbridgeacademics.co.uk' && (url.pathname === '/' || url.pathname === '')) {
    const targetUrl = new URL('/tutor-waitlist/index.html', request.url);
    return new Response(null, {
      status: 200,
      headers: {
        'x-middleware-rewrite': targetUrl.toString()
      }
    });
  }

  return new Response(null, {
    status: 200,
    headers: {
      'x-middleware-next': '1'
    }
  });
}

export const config = {
  matcher: '/'
};
