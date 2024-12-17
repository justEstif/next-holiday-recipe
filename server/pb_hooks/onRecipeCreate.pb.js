/// <reference path="../pb_data/types.d.ts" />
// onRecordCreateRequest((e) => {
//   // Check if the request has an authenticated user
//   if (!e.auth) {
//     throw new UnauthorizedError("You must be logged in to create a recipe.");
//   }
//
//   // Optionally, enforce that only admin users can create recipes
//   // if (!e.auth.isSuperuser()) {
//   //   throw new ForbiddenError("Only administrators can create recipes.");
//   // }
//
//   // Proceed with the record creation
//   e.next();
// }, "recipes");
