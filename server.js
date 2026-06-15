export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/search") {
      const query = url.searchParams.get("query");
      const perPage = url.searchParams.get("per_page") || "30";

      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`,
        {
          headers: {
            Authorization: env.PEXELS_API_KEY,
          },
        },
      );

      return new Response(await response.text(), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
