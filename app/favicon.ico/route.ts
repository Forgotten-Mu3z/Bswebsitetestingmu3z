export function GET(request: Request) {
  return Response.redirect(new URL('/blackshark-logo.png', request.url), 302);
}
