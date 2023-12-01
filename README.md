## Glimpse, for Todoist

![Screenshot of Glimpse](/public/screenshot.png)

**Glimpse** is a todo application that provides a view of your upcoming tasks in a column layout inspired by [TeuxDeux](https://teuxdeux.com/). It hooks into your [Todoist](https://todoist.com/) account with your [API key](https://todoist.com/help/articles/find-your-api-token-Jpzx9IIlB) to be able to store your tasks. Your API token is stored locally in your browser and all API calls are made from your browser, meaning your API token is safe.

For the technical details, this site is built using [Next.js](https://nextjs.org/) and [React](https://react.dev/). I'm using [TanStack Query](https://tanstack.com/query/latest) (FKA React Query) for state management, fetching, and mutating. It also relies on the [Todoist Typescript API Client](https://github.com/doist/todoist-api-typescript) to get types and make my life easier. For styling and components, I'm using [Tailwind](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/).
