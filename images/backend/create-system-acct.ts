/**
 * This script creates a system account for the self-hosted environment.
 */
import { ensureDbConnection } from "@/wab/server/db/DbCon";
import { DbMgr, normalActor, SUPER_USER } from "@/wab/server/db/DbMgr";
import { FeatureTier, User } from "@/wab/server/entities/Entities";
import { getBundleInfo, PkgMgr } from "@/wab/server/pkg-mgr";
import { initializeGlobals } from "@/wab/server/svr-init";
import { ensureType, spawn } from "@/wab/shared/common";
import { defaultComponentKinds } from "@/wab/shared/core/components";
import { InsertableTemplatesGroup, Installable } from "@/wab/shared/devflags";
import {
  InsertableId,
  PLEXUS_INSERTABLE_ID,
  PLUME_INSERTABLE_ID,
} from "@/wab/shared/insertables";
import { kebabCase, startCase } from "lodash";
import { EntityManager } from "typeorm";
import { appConfig } from "../nfigure-config";
import { doImportProject } from "../routes/projects";
import { Bundler } from "@/wab/shared/bundler";
import { readFileSync } from "node:fs";

initializeGlobals();

if (require.main === module) {
  spawn(main());
}

async function main() {
  const con = await ensureDbConnection(appConfig.databaseUri!, "default");
  await con.transaction(async (em) => {
    await seedInitialData(em);
    console.log("Seeding initial data done");
  });
}

async function seedInitialData(em: EntityManager) {
  const db = new DbMgr(em, SUPER_USER);

  // check if the database is empty
  const userCount = await em.count(User);
  if (userCount > 0) {
    console.log(
      "There are already users in the database. Seeding is not needed."
    );
    return;
  }

  const { user: adminUser } = await createUser(em, {
    email: "root@aoki.app",
    firstName: "System",
    lastName: "Root",
  });

  const { enterpriseFt } = await seedFeatureTiers(em);
  // Seed the special pkgs, which must be done after some users have been created
  const sysnames: InsertableId[] = [PLUME_INSERTABLE_ID, PLEXUS_INSERTABLE_ID];
  await Promise.all(
    sysnames.map(async (sysname) => await new PkgMgr(db, sysname).seedPkg())
  );

  const plexusBundleInfo = getBundleInfo(PLEXUS_INSERTABLE_ID);

  await db.setDevFlagOverrides(
    JSON.stringify(
      {
        plexus: true,
        installables: ensureType<Installable[] | undefined>([
          {
            type: "ui-kit",
            isInstallOnly: true,
            isNew: true,
            name: "Plasmic Design System",
            projectId: plexusBundleInfo.projectId,
            imageUrl: "https://static1.plasmic.app/plasmic-logo.png",
            entryPoint: {
              type: "arena",
              name: "Components",
            },
          },
        ]),
        insertableTemplates: ensureType<InsertableTemplatesGroup | undefined>({
          type: "insertable-templates-group",
          name: "root",
          // The below achieves the following for each plexus component:
          // {
          //   "type": "insertable-templates-component",
          //   "projectId": "mSQqkNd8CL5vNdDTXJPXfU",
          //   "componentName": "Plexus Button",
          //   "templateName": "plexus/button",
          //   "imageUrl": "https://static1.plasmic.app/antd_button.svg"
          // }
          items: [
            {
              type: "insertable-templates-group" as const,
              name: "Components",
              items: Object.keys(defaultComponentKinds).map((item) => ({
                componentName: startCase(item),
                templateName: `${plexusBundleInfo.sysname}/${kebabCase(item)}`,
                imageUrl: `https://static1.plasmic.app/insertables/${kebabCase(
                  item
                )}.svg`,
                type: "insertable-templates-component" as const,
                projectId: plexusBundleInfo.projectId,
                tokenResolution: "reuse-by-name" as const,
              })),
            },
          ].filter((insertableGroup) => insertableGroup.items.length > 0),
        }),
        insertPanelContent: {
          aliases: {
            // Components provided by @plasmicapp/react-web
            dataFetcher: "builtincc:plasmic-data-source-fetcher",
            pageMeta: "builtincc:hostless-plasmic-head",

            // Default components
            ...Object.keys(defaultComponentKinds).reduce((acc, defaultKind) => {
              acc[defaultKind] = `default:${defaultKind}`;
              return acc;
            }, {}),
          },
          builtinSections: {
            Home: {
              Basic: [
                "text",
                "heading",
                "link",
                "linkContainer",
                "section",
                "columns",
                "vstack",
                "hstack",
                "grid",
                "box",
                "image",
                "icon",
              ],
              // This may use Plexus or Plume depending on the `plexus` devflag
              "Customizable components": Object.keys(defaultComponentKinds),
              Advanced: ["pageMeta", "dataFetcher"],
            },
          },
          // Install all button
          builtinSectionsInstallables: {
            // We only need it for Plexus
            "Customizable components": plexusBundleInfo.projectId,
          },
        },
        copilotTab: true,
        copilotClaude: true,
        sso: true,
        posthog: false,
        enableUiCopilot: true,
        adminUiEnableDomain: appConfig.adminUiEnableDomain,
      },
      null,
      2
    )
  );

  const dbAsSHUser = new DbMgr(em, normalActor(adminUser.id));
  const bundles = JSON.parse(readFileSync("./bundlez.json").toString());

  await doImportProject(bundles, dbAsSHUser, new Bundler(), {
    keepProjectIdsAndNames: true,
  });
}

async function createUser(
  em: EntityManager,
  userInfo: {
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  }
) {
  const db = new DbMgr(em, SUPER_USER);
  const user = await db.createUser({
    email: userInfo.email,
    firstName: userInfo.firstName || "Plasmic",
    lastName: userInfo.lastName || "User",
    needsIntroSplash: false,
    needsSurvey: false,
    needsTeamCreationPrompt: false,
  });
  await db.markEmailAsVerified(user);
  return { user };
}
function seedFeatureTiers(em: EntityManager) {
  const db0 = new DbMgr(em, SUPER_USER);
  return {
    enterpriseFt: db0.addFeatureTier(enterpriseFt),
  };
}

const enterpriseFt: FeatureTier = {
  name: "Enterprise",
  monthlyBasePrice: null,
  monthlyBaseStripePriceId: null,
  annualBasePrice: null,
  annualBaseStripePriceId: null,
  monthlySeatPrice: 80,
  monthlySeatStripePriceId: "price_1Ji3EFHIopbCiFeiUCtiVOyB",
  annualSeatPrice: 768,
  annualSeatStripePriceId: "price_1Ji3EFHIopbCiFeiSj0U8o1K",
  minUsers: 30,
  maxUsers: 1_000,
  monthlyViews: 1_000_000,
  versionHistoryDays: 180,
  analytics: true,
  contentRole: true,
  designerRole: true,
  editContentCreatorMode: true,
  localization: true,
  splitContent: true,
  privateUsersIncluded: null,
  maxPrivateUsers: null,
  publicUsersIncluded: null,
  maxPublicUsers: null,
  maxWorkspaces: null,
} as FeatureTier;
