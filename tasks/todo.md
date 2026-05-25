# Vite to Next.js Migration Plan

- [ ] 1. Clean up Vite files: Delete `vite.config.ts`, `index.html`, `tsconfig.app.json`, `tsconfig.node.json`, `src/main.tsx`, `src/App.tsx`, and `src/App.css`.
- [ ] 2. Update `package.json`: Remove Vite dependencies and add Next.js dependencies. Update scripts (`dev`, `build`, `start`).
- [ ] 3. Update `tsconfig.json`: Set up a standard Next.js TypeScript configuration.
- [ ] 4. Create Next.js App Router structure: Create `src/app` directory.
- [ ] 5. Create `src/app/layout.tsx`: Move the `index.html` structure and global layout setup here.
- [ ] 6. Move and rename CSS: Move `src/index.css` to `src/app/globals.css`.
- [ ] 7. Create `src/app/page.tsx`: Import and render `LoginPage` here replacing `src/App.tsx`.
- [ ] 8. Update Configurations: Update `components.json` and `tailwind.config.js` to point to the new CSS file and app directory.
- [ ] 9. Install Dependencies: Run `npm install` to apply changes.
- [ ] 10. Verify: Run the server `npm run dev` to verify the application loads correctly.
