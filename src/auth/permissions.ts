/**
 *
 */

import { Assets } from "./assets";
import { Methods } from "./methods";
import { Roles } from "./roles";


const adminPermissions = new Set([
	`${Methods.GET}:${Assets.TAG}`,
	`${Methods.POST}:${Assets.TAG}`,
	`${Methods.PATCH}:${Assets.TAG}`,
	`${Methods.DELETE}:${Assets.TAG}`,

	`${Methods.GET}:${Assets.CATE}`,
	`${Methods.POST}:${Assets.CATE}`,
	`${Methods.PATCH}:${Assets.CATE}`,
	`${Methods.DELETE}:${Assets.CATE}`,

	`${Methods.GET}:${Assets.NOTE}`,
	`${Methods.POST}:${Assets.NOTE}`,
	`${Methods.PATCH}:${Assets.NOTE}`,
	`${Methods.DELETE}:${Assets.NOTE}`,

	`${Methods.GET}:${Assets.IMAGE}`,
	`${Methods.POST}:${Assets.IMAGE}`,
	`${Methods.PATCH}:${Assets.IMAGE}`,
	`${Methods.DELETE}:${Assets.IMAGE}`,

	`${Methods.GET}:${Assets.USER}`,
	`${Methods.POST}:${Assets.USER}`,
	`${Methods.PATCH}:${Assets.USER}`,
	`${Methods.DELETE}:${Assets.USER}`,
]);

function verifyPermission(roleId: number, m: Methods, a: Assets): boolean {
	if (roleId === Roles.ADMIN) {
		return adminPermissions.has(`${m}:${a}`);
	}
	return false;
}

const permissionsMap = new Map<Roles, Set<string>>();
permissionsMap.set(Roles.ADMIN, adminPermissions);


export {
	verifyPermission,
}