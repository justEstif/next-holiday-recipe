This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

- Using this [blog](https://dev.to/tigawanna/nextjs13-app-directory-authentication-with-pocketbase-2p6d)

# **Public Pages (No Authentication Required)**

- **Home Page** (`/`)
- **Recipe Listing Page** (`/recipes`)
- **Recipe Details Page** (`/recipes/[recipeId]`)
- **User Profile Page** (`/users/[userId]`)
- **Search Results Page** (`/search`)
- **Viewing Comments and Ratings** (on Recipe Details Page)
- **Authentication Pages** (`/login`, `/auth/callback`)
- **Error and Status Pages** (`/404`, `/500`)

---

# **Protected Pages (Authentication Required)**

- **Submit New Recipe Page** (`/recipes/new`)
- **Edit Recipe Page** (`/recipes/[recipeId]/edit`)
- **Edit Profile Page** (`/users/[userId]/edit`)
- **Posting Comments and Ratings** (on Recipe Details Page)
    - the component should be hidden
- **Logout Page** (`/sign-out`)
- **Admin Dashboard** (`/admin`) - _If implemented; requires admin role._

---

# **Public API Endpoints**

- **Fetching recipes, recipe details, user profiles, and search results.**

---

# **Protected API Endpoints**

- **Creating, editing, or deleting recipes** (only by the recipe's author or admin).
- **Posting comments or ratings.**
- **Editing user profiles** (only by the profile owner).
- **Admin actions** like deleting any user's recipe or comment.
