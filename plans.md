# Plans

## June 29th:
- Leave the auth middleware as the last thing to do.
- Protect [admin, teacher, student] by their own middlewares.
- implement some admin logic.
- sparating routes by entity not by roles:
    - Having something like {admin.route.ts, teacher.route.ts and shared.route.ts} is not a good API design, as the roles middlewares already ensures the roles
    - Something like {deps.route.ts, classe.route.ts is way more cleaner to have}