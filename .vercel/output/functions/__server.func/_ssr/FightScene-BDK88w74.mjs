import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as CanvasTexture, c as Material, d as MeshStandardMaterial, f as RepeatWrapping, h as Vector3, i as BoxGeometry, l as MathUtils, m as SphereGeometry, n as useFrame, o as CircleGeometry, p as SRGBColorSpace, r as useThree, s as FogExp2, t as Canvas, u as MeshBasicMaterial, v as require_jsx_runtime } from "../_libs/@react-three/fiber+[...].mjs";
import { A as LAMPS, C as input, D as BOLLARDS, E as BIN, O as CARS, S as held, T as setLockTarget, _ as attachInput, a as finishTape, b as consumeZoom, c as replayNow, d as tapeAudio, f as attachControlsTest, g as tickSim, h as summarize, i as beginTape, j as PUB, k as CROWD, l as stampTape, m as sim, n as advanceReplay, o as keyAt, p as scoreFrame, r as applyKeyToSim, s as lastReplay, u as useTape, v as consumeLook, w as lockPointer, x as detachInput, y as consumePanic } from "./routes-DBC29-F1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/FightScene-BDK88w74.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function World({ mats, sirens }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			material: mats.asphalt,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [42, 42] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				.01,
				13.6
			],
			material: mats.road,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [42, 8] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				0,
				.06,
				9.55
			],
			material: mats.brick,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				42,
				.12,
				.55
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				PUB.x,
				0,
				PUB.z
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						0,
						PUB.h / 2,
						0
					],
					material: mats.brick,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						PUB.w,
						PUB.h,
						PUB.d
					] })
				}),
				[
					-3.6,
					-1.2,
					1.2,
					3.6
				].map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						PUB.w / 2 - .04,
						2.45,
						z
					],
					material: mats.windows,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.1,
						1.55,
						1.35
					] })
				}, z)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						PUB.w / 2 + .04,
						1.15,
						0
					],
					material: mats.dark,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.12,
						2.3,
						1.2
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						PUB.w / 2 + .07,
						4.55,
						0
					],
					rotation: [
						0,
						Math.PI / 2,
						0
					],
					material: mats.sign,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [3.6, .9] })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				0,
				1.8,
				-15.1
			],
			material: mats.brick,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				34,
				3.6,
				.55
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				-16.8,
				2.2,
				-1
			],
			material: mats.brick,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.55,
				4.4,
				28
			] })
		}),
		CARS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				c.x,
				0,
				c.z
			],
			rotation: [
				0,
				c.rot,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						0,
						.02,
						0
					],
					rotation: [
						-Math.PI / 2,
						0,
						0
					],
					material: mats.shadow,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [1.3, 10] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						.48,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						c.w,
						.58,
						c.l
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: c.color,
						roughness: .38,
						metalness: .42
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						.92,
						-c.l * .08
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						c.w * .88,
						.42,
						c.l * .48
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: c.cabin,
						roughness: .25,
						metalness: .2
					})]
				})
			]
		}, `${c.x}-${c.z}`)),
		LAMPS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				l.x,
				0,
				l.z
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						0,
						2.2,
						0
					],
					material: mats.metal,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.055,
						.08,
						4.4,
						6
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						0,
						4.45,
						0
					],
					material: mats.glow,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.15,
						8,
						8
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
					color: "#ffc890",
					intensity: 55,
					distance: 20,
					position: [
						0,
						4.25,
						0
					],
					decay: 1.4
				})
			]
		}, `${l.x}-${l.z}`)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				BIN.x,
				.55,
				BIN.z
			],
			material: mats.bin,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.85,
				1.1,
				.85
			] })
		}),
		BOLLARDS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				b.x,
				.38,
				b.z
			],
			material: mats.metal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.09,
				.1,
				.76,
				8
			] })
		}, `${b.x}-${b.z}`)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				-10,
				8,
				-28
			],
			material: mats.windows,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				18,
				16,
				2
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				14,
				7,
				-32
			],
			material: mats.windows,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				16,
				14,
				2
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				26,
				6,
				2
			],
			material: mats.windows,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				2,
				12,
				18
			] })
		}),
		sirens ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				-2.2,
				0,
				14.5
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						.5,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						1.8,
						.7,
						4.4
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#1c242c",
						roughness: .45,
						metalness: .35
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						-.35,
						1.05,
						.2
					],
					material: mats.copR,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.3,
						.16,
						.5
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						.35,
						1.05,
						.2
					],
					material: mats.copB,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.3,
						.16,
						.5
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
					color: "#c4453c",
					intensity: 10,
					distance: 10,
					position: [
						-.4,
						1.2,
						0
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
					color: "#3a6aa8",
					intensity: 10,
					distance: 10,
					position: [
						.4,
						1.2,
						0
					]
				})
			]
		}) : null
	] });
}
function bindBones(el) {
	if (!el) return;
	el.userData.bones = {
		body: el.getObjectByName("body"),
		armL: el.getObjectByName("armL"),
		armR: el.getObjectByName("armR"),
		legL: el.getObjectByName("legL"),
		legR: el.getObjectByName("legR")
	};
}
var Person = (0, import_react.forwardRef)(function Person({ mats, geos, shirt, skin, hasPhone = false, scale = 1 }, ref) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: (el) => {
			bindBones(el);
			if (typeof ref === "function") ref(el);
			else if (ref) ref.current = el;
		},
		scale,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			name: "shadow",
			geometry: geos.shadow,
			material: mats.shadow,
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				.02,
				0
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			name: "body",
			position: [
				0,
				.92,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					geometry: geos.torso,
					material: shirt
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					geometry: geos.head,
					material: skin,
					position: [
						0,
						.4,
						0
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					geometry: geos.hair,
					material: mats.hair,
					position: [
						0,
						.46,
						-.01
					],
					scale: [
						1.02,
						.55,
						1.05
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
					name: "armL",
					position: [
						-.24,
						.18,
						0
					],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
						geometry: geos.arm,
						material: shirt,
						position: [
							0,
							-.2,
							0
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
					name: "armR",
					position: [
						.24,
						.18,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
						geometry: geos.arm,
						material: shirt,
						position: [
							0,
							-.2,
							0
						]
					}), hasPhone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
						position: [
							0,
							-.42,
							.08
						],
						rotation: [
							-1.15,
							0,
							0
						],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
							geometry: geos.phone,
							material: mats.phone
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
							geometry: geos.phone,
							material: mats.screen,
							position: [
								0,
								0,
								.012
							],
							scale: [
								.78,
								.78,
								.2
							]
						})]
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
					name: "legL",
					position: [
						-.1,
						-.26,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
						geometry: geos.leg,
						material: mats.jeans,
						position: [
							0,
							-.28,
							0
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
						geometry: geos.foot,
						material: mats.shoe,
						position: [
							0,
							-.56,
							.04
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
					name: "legR",
					position: [
						.1,
						-.26,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
						geometry: geos.leg,
						material: mats.jeans,
						position: [
							0,
							-.28,
							0
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
						geometry: geos.foot,
						material: mats.shoe,
						position: [
							0,
							-.56,
							.04
						]
					})]
				})
			]
		})]
	});
});
function applyFighterPose(group, f) {
	group.position.set(f.x, 0, f.z);
	group.rotation.y = f.yaw;
	const bones = group.userData.bones;
	if (!bones?.body) return;
	bones.body.rotation.z = f.downAmt * 1.32;
	bones.body.rotation.x = f.downAmt * .28 + (f.state === "hit" ? -.18 : 0);
	bones.body.position.y = .92 - f.downAmt * .72;
	const walk = f.state === "down" || f.state === "getup" ? 0 : Math.sin(f.walk);
	bones.armR.rotation.x = -f.punch * 1.72;
	bones.armL.rotation.x = f.state === "hit" ? -.85 : walk * .42 * (1 - f.downAmt);
	bones.legL.rotation.x = walk * .55 * (1 - f.downAmt);
	bones.legR.rotation.x = -walk * .55 * (1 - f.downAmt);
}
function applyCrowdPose(group, t, i, recoil, base) {
	const r = base.r + recoil * .45;
	const x = Math.cos(base.ang) * r;
	const z = Math.sin(base.ang) * r;
	group.position.set(x, 0, z);
	group.rotation.y = Math.atan2(-x, -z);
	const bones = group.userData.bones;
	if (!bones?.armR) return;
	bones.armR.rotation.x = base.phone ? -1.35 : Math.sin(t * 1.4 + i) * .12;
	bones.armL.rotation.x = Math.sin(t * 1.4 + i + 1) * .12;
	bones.body.rotation.y = Math.sin(t * .7 + i) * .08;
}
function canvasTex(size, draw, repeat = 1) {
	const c = document.createElement("canvas");
	c.width = size;
	c.height = size;
	const ctx = c.getContext("2d");
	if (!ctx) throw new Error("canvas");
	draw(ctx, size);
	const tex = new CanvasTexture(c);
	tex.colorSpace = SRGBColorSpace;
	tex.wrapS = RepeatWrapping;
	tex.wrapT = RepeatWrapping;
	tex.repeat.set(repeat, repeat);
	tex.anisotropy = 4;
	tex.needsUpdate = true;
	return tex;
}
function asphalt(ctx, n) {
	ctx.fillStyle = "#4a4744";
	ctx.fillRect(0, 0, n, n);
	for (let i = 0; i < 2400; i += 1) {
		const x = Math.random() * n;
		const y = Math.random() * n;
		const v = 72 + Math.random() * 48;
		ctx.fillStyle = `rgb(${v},${v - 2},${v - 6})`;
		ctx.fillRect(x, y, 1 + Math.random() * 2, 1);
	}
	ctx.strokeStyle = "rgba(0,0,0,0.18)";
	ctx.lineWidth = 1;
	for (let i = 0; i < 14; i += 1) {
		ctx.beginPath();
		ctx.moveTo(Math.random() * n, Math.random() * n);
		ctx.lineTo(Math.random() * n, Math.random() * n);
		ctx.stroke();
	}
}
function brick(ctx, n) {
	ctx.fillStyle = "#4a403c";
	ctx.fillRect(0, 0, n, n);
	const bh = 18;
	const bw = 42;
	for (let y = 0, row = 0; y < n; y += bh, row += 1) {
		const off = row % 2 === 0 ? 0 : bw / 2;
		for (let x = -42; x < n; x += bw) {
			ctx.fillStyle = `rgb(${128 + (x * 13 + y * 7) % 36},${78 + (x * 5 + y) % 22},${62 + y * 3 % 16})`;
			ctx.fillRect(x + off + 1, y + 1, 40, 16);
		}
	}
}
function windows(ctx, n) {
	ctx.fillStyle = "#121318";
	ctx.fillRect(0, 0, n, n);
	const cell = 18;
	for (let y = 8; y < n; y += cell) for (let x = 8; x < n; x += cell) {
		if (Math.random() > .38) continue;
		ctx.fillStyle = Math.random() > .45 ? "#d4b07a" : "#1c1e24";
		ctx.fillRect(x, y, 7, 9);
	}
}
function signTex() {
	const c = document.createElement("canvas");
	c.width = 512;
	c.height = 128;
	const ctx = c.getContext("2d");
	if (!ctx) throw new Error("canvas");
	ctx.fillStyle = "#161518";
	ctx.fillRect(0, 0, 512, 128);
	ctx.fillStyle = "#eceae6";
	ctx.font = "700 52px 'Arial Narrow', Impact, sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("THE BLIND SPOT", 256, 52);
	ctx.font = "500 16px system-ui, sans-serif";
	ctx.fillStyle = "#9a9894";
	ctx.fillText("NIGHTLY DISAPPOINTMENT", 256, 96);
	const tex = new CanvasTexture(c);
	tex.colorSpace = SRGBColorSpace;
	tex.needsUpdate = true;
	return tex;
}
function createMaterials() {
	const asphaltMap = canvasTex(256, asphalt, 14);
	const brickMap = canvasTex(256, brick, 3);
	const windowMap = canvasTex(256, windows, 2);
	const signMap = signTex();
	return {
		asphalt: new MeshStandardMaterial({
			map: asphaltMap,
			roughness: .72,
			metalness: .06,
			color: "#d0cbc4"
		}),
		road: new MeshStandardMaterial({
			color: "#3a3632",
			roughness: .74,
			metalness: .06
		}),
		brick: new MeshStandardMaterial({
			map: brickMap,
			roughness: .88,
			metalness: .02,
			color: "#e8d8cc"
		}),
		windows: new MeshStandardMaterial({
			map: windowMap,
			roughness: .5,
			metalness: .1,
			emissive: "#c9a46a",
			emissiveIntensity: 1.15
		}),
		sign: new MeshBasicMaterial({ map: signMap }),
		skin: new MeshStandardMaterial({
			color: "#e0b894",
			roughness: .65
		}),
		skin2: new MeshStandardMaterial({
			color: "#c4926a",
			roughness: .65
		}),
		hair: new MeshStandardMaterial({
			color: "#2a221e",
			roughness: .9
		}),
		red: new MeshStandardMaterial({
			color: "#c43c38",
			roughness: .5
		}),
		navy: new MeshStandardMaterial({
			color: "#3e5878",
			roughness: .55
		}),
		jeans: new MeshStandardMaterial({
			color: "#4a5a70",
			roughness: .8
		}),
		dark: new MeshStandardMaterial({
			color: "#3a3a40",
			roughness: .8
		}),
		shoe: new MeshStandardMaterial({
			color: "#2a2a2c",
			roughness: .5
		}),
		crowd: [
			new MeshStandardMaterial({
				color: "#4a4e56",
				roughness: .7
			}),
			new MeshStandardMaterial({
				color: "#5a4c42",
				roughness: .7
			}),
			new MeshStandardMaterial({
				color: "#3e4650",
				roughness: .7
			}),
			new MeshStandardMaterial({
				color: "#6a5848",
				roughness: .7
			})
		],
		phone: new MeshStandardMaterial({
			color: "#0e0e10",
			roughness: .35,
			metalness: .4
		}),
		screen: new MeshBasicMaterial({ color: "#c9d4de" }),
		metal: new MeshStandardMaterial({
			color: "#3a3d42",
			roughness: .4,
			metalness: .6
		}),
		bin: new MeshStandardMaterial({
			color: "#243028",
			roughness: .7
		}),
		glow: new MeshBasicMaterial({ color: "#ffe2b0" }),
		shadow: new MeshBasicMaterial({
			color: "#000000",
			transparent: true,
			opacity: .2,
			depthWrite: false
		}),
		spark: new MeshBasicMaterial({ color: "#f2e6c9" }),
		copR: new MeshBasicMaterial({ color: "#c4453c" }),
		copB: new MeshBasicMaterial({ color: "#3a6aa8" }),
		dispose() {
			asphaltMap.dispose();
			brickMap.dispose();
			windowMap.dispose();
			signMap.dispose();
			for (const m of Object.values(this)) if (m instanceof Material) m.dispose();
			for (const m of this.crowd) m.dispose();
		}
	};
}
function createGeos() {
	return {
		torso: new BoxGeometry(.38, .52, .22),
		head: new SphereGeometry(.128, 10, 8),
		hair: new SphereGeometry(.134, 10, 8),
		arm: new BoxGeometry(.09, .46, .09),
		leg: new BoxGeometry(.12, .54, .12),
		foot: new BoxGeometry(.12, .08, .22),
		phone: new BoxGeometry(.07, .14, .018),
		shadow: new CircleGeometry(.32, 12),
		dispose() {
			this.torso.dispose();
			this.head.dispose();
			this.hair.dispose();
			this.arm.dispose();
			this.leg.dispose();
			this.foot.dispose();
			this.phone.dispose();
			this.shadow.dispose();
		}
	};
}
var visV = new Vector3();
function Loop({ f0, f1, crowd, sparks }) {
	const sparkPool = (0, import_react.useRef)(Array.from({ length: 16 }, () => ({
		x: 0,
		y: 0,
		z: 0,
		vx: 0,
		vy: 0,
		vz: 0,
		life: 0
	})));
	const hudAcc = (0, import_react.useRef)(0);
	const sirenOnce = (0, import_react.useRef)(false);
	const lastHit = (0, import_react.useRef)(false);
	const shoveOnce = (0, import_react.useRef)(false);
	const shoutOnce = (0, import_react.useRef)(false);
	useFrame(({ camera }, delta) => {
		const dt = Math.min(delta, .08);
		const phase = useTape.getState().phase;
		const playing = phase === "playing";
		const replaying = phase === "replay";
		if (replaying) {
			sim.animTime += dt;
			const tape = lastReplay();
			const t = advanceReplay(dt);
			if (!tape || t >= Math.max(tape.len, .2)) {
				const back = useTape.getState().replayFrom ?? "results";
				if (back === "menu") tapeAudio.stopCrowd();
				useTape.setState({
					phase: back,
					event: "none"
				});
			} else {
				const k = keyAt(tape, t);
				if (k) applyKeyToSim(k);
			}
		} else {
			let moveF = 0;
			let moveR = 0;
			if (held("KeyW") || held("ArrowUp")) moveF += 1;
			if (held("KeyS") || held("ArrowDown")) moveF -= 1;
			if (held("KeyD") || held("ArrowRight")) moveR += 1;
			if (held("KeyA") || held("ArrowLeft")) moveR -= 1;
			moveF += -input.joyY;
			moveR += input.joyX;
			if (held("KeyQ")) input.zoomDelta += dt * 1.4;
			if (held("KeyE")) input.zoomDelta -= dt * 1.4;
			const look = consumeLook();
			const zoom = consumeZoom();
			const panic = consumePanic();
			tickSim(dt, {
				moveF,
				moveR,
				lookX: look.x,
				lookY: look.y,
				zoomDelta: zoom,
				sprint: held("ShiftLeft") || held("ShiftRight"),
				panic,
				playing
			});
		}
		const cam = camera;
		cam.rotation.order = "YXZ";
		if (playing || replaying) {
			const n1 = Math.sin(sim.animTime * 23.1) * .4 + Math.sin(sim.animTime * 51.7) * .25;
			const n2 = Math.sin(sim.animTime * 19.4 + 1) * .4 + Math.sin(sim.animTime * 44.2) * .2;
			const n3 = Math.sin(sim.animTime * 11.2) * .45 + Math.sin(sim.animTime * 31.8) * .2;
			const amp = (.012 + sim.panic * .05) * (sim.sprint ? 2.1 : 1) * (sim.event === "trip" || sim.event === "shove" ? 2.2 : 1);
			cam.position.set(sim.px, sim.eye, sim.pz);
			cam.rotation.y = sim.yaw + n1 * amp * 6;
			cam.rotation.x = sim.pitch + n2 * amp * 6;
			cam.rotation.z = sim.roll + n3 * amp * 3;
			const fov = MathUtils.lerp(70, 24, (sim.zoom - 1) / 2.8);
			if (Math.abs(cam.fov - fov) > .04) {
				cam.fov = fov;
				cam.updateProjectionMatrix();
			}
		} else {
			const a = sim.animTime * .16;
			cam.position.set(Math.sin(a) * 7.6 + 3.2, 2.85, Math.cos(a) * 6.8 + 4.4);
			cam.lookAt(0, 1.05, 0);
			if (Math.abs(cam.fov - 48) > .1) {
				cam.fov = 48;
				cam.updateProjectionMatrix();
			}
		}
		if (playing) {
			const vis = (x, y, z) => {
				visV.set(x, y, z).project(camera);
				return visV.z > -1 && visV.z < 1 && Math.abs(visV.x) < .72 && Math.abs(visV.y) < .78;
			};
			scoreFrame(vis, dt);
		}
		if (f0.current) applyFighterPose(f0.current, sim.f[0]);
		if (f1.current) applyFighterPose(f1.current, sim.f[1]);
		crowd.current.forEach((g, i) => {
			if (!g) return;
			const c = CROWD[i];
			if (!c) return;
			applyCrowdPose(g, sim.animTime, i, sim.crowdRecoil, c);
		});
		const pool = sparkPool.current;
		if (sim.pendingHit && !lastHit.current) {
			lastHit.current = true;
			tapeAudio.punch(sim.pendingHit.heavy);
			tapeAudio.setCrowdHeat(sim.pendingHit.heavy ? .95 : .55);
			for (let i = 0; i < 8; i += 1) {
				const p = pool[i];
				p.x = sim.pendingHit.x;
				p.y = 1.3;
				p.z = sim.pendingHit.z;
				p.vx = (Math.random() - .5) * 4;
				p.vy = 2 + Math.random() * 3;
				p.vz = (Math.random() - .5) * 4;
				p.life = .35 + Math.random() * .2;
			}
		}
		if (!sim.pendingHit) lastHit.current = false;
		if (sim.event === "shove") {
			if (!shoveOnce.current) {
				shoveOnce.current = true;
				tapeAudio.shove();
			}
		} else shoveOnce.current = false;
		if (sim.event === "commentary") {
			if (!shoutOnce.current) {
				shoutOnce.current = true;
				tapeAudio.whoa();
			}
		} else shoutOnce.current = false;
		if (!sim.sirens) sirenOnce.current = false;
		if (sim.sirens && !sirenOnce.current && playing) {
			sirenOnce.current = true;
			tapeAudio.siren();
		}
		for (let i = 0; i < pool.length; i += 1) {
			const p = pool[i];
			const mesh = sparks.current[i];
			if (p.life > 0) {
				p.life -= dt;
				p.vy -= 9 * dt;
				p.x += p.vx * dt;
				p.y += p.vy * dt;
				p.z += p.vz * dt;
				if (mesh) {
					mesh.visible = true;
					mesh.position.set(p.x, p.y, p.z);
				}
			} else if (mesh) mesh.visible = false;
		}
		if (sim.wantEnd && phase === "playing") {
			const results = summarize(sim);
			sim.ended = true;
			tapeAudio.stopCrowd();
			useTape.setState({
				phase: "results",
				results,
				score: results.score,
				clips: results.clips,
				note: results.roast,
				missing: false,
				sirens: true
			});
			if (typeof document !== "undefined" && document.exitPointerLock) document.exitPointerLock();
		}
		hudAcc.current += dt;
		if (hudAcc.current > .09 || sim.flashT > 0) {
			hudAcc.current = 0;
			useTape.setState({
				takeTime: replaying ? replayNow() : sim.takeTime,
				takeLen: replaying ? lastReplay()?.len ?? 68 : 68,
				score: Math.round(sim.score),
				viral: sim.viral,
				clips: sim.clips,
				zoom: sim.zoom,
				battery: sim.battery,
				note: sim.note,
				event: sim.event,
				flash: sim.flash,
				caption: sim.caption,
				inFrame: sim.inFrame,
				missing: playing && !input.isTouch && !input.pointerLocked,
				sirens: sim.sirens
			});
		}
	});
	return null;
}
function CaptureCanvas() {
	const { gl } = useThree();
	const phase = useTape((s) => s.phase);
	const last = (0, import_react.useRef)("");
	(0, import_react.useEffect)(() => {
		setLockTarget(gl.domElement);
		gl.domElement.style.touchAction = "none";
		return () => setLockTarget(null);
	}, [gl]);
	(0, import_react.useEffect)(() => {
		if (phase === "playing" && last.current !== "playing") beginTape(gl.domElement);
		if (phase === "results" && last.current === "playing") finishTape().then((tape) => {
			const replay = lastReplay();
			const prev = useTape.getState().tapeUrl;
			if (prev) URL.revokeObjectURL(prev);
			if (tape) useTape.setState({
				tapeUrl: URL.createObjectURL(tape.blob),
				tapeMime: tape.mime,
				tapeRoll: "ready"
			});
			else if (replay && replay.keys.length > 2) useTape.setState({
				tapeUrl: null,
				tapeMime: "",
				tapeRoll: "replay"
			});
			else useTape.setState({ tapeRoll: "failed" });
		});
		last.current = phase;
	}, [phase]);
	useFrame(() => {
		const s = useTape.getState();
		if (s.phase === "playing") stampTape(gl.domElement, {
			takeTime: s.takeTime,
			event: s.event,
			battery: s.battery
		});
	}, 1);
	return null;
}
function FightScene() {
	const mats = (0, import_react.useMemo)(() => createMaterials(), []);
	const geos = (0, import_react.useMemo)(() => createGeos(), []);
	const f0 = (0, import_react.useRef)(null);
	const f1 = (0, import_react.useRef)(null);
	const crowd = (0, import_react.useRef)([]);
	const sparks = (0, import_react.useRef)([]);
	const sirens = useTape((s) => s.sirens || s.phase === "results");
	(0, import_react.useEffect)(() => {
		attachInput();
		attachControlsTest();
		return () => {
			detachInput();
			mats.dispose();
			geos.dispose();
		};
	}, [mats, geos]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
		camera: {
			fov: 50,
			near: .08,
			far: 90,
			position: [
				8,
				2.6,
				8
			]
		},
		dpr: [1, 1.5],
		gl: {
			antialias: true,
			preserveDrawingBuffer: true,
			powerPreference: "high-performance"
		},
		onCreated: ({ gl, scene }) => {
			gl.setClearColor("#2a241c");
			gl.toneMapping = 4;
			gl.toneMappingExposure = 1.55;
			scene.fog = new FogExp2("#2c261e", .016);
			setLockTarget(gl.domElement);
		},
		onPointerDown: () => {
			if (useTape.getState().phase === "playing") lockPointer();
		},
		style: {
			touchAction: "none",
			height: "100%",
			width: "100%"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", {
				color: "#8a97a8",
				groundColor: "#4a3c2e",
				intensity: 1.05
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .48 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				color: "#ffd2a8",
				intensity: 1.35,
				position: [
					8,
					12,
					6
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
				color: "#ffc896",
				intensity: 36,
				distance: 16,
				decay: 1.4,
				position: [
					0,
					5.2,
					0
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {
				mats,
				sirens
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Person, {
				ref: f0,
				mats,
				geos,
				shirt: mats.red,
				skin: mats.skin
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Person, {
				ref: f1,
				mats,
				geos,
				shirt: mats.navy,
				skin: mats.skin2
			}),
			CROWD.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Person, {
				ref: (el) => {
					crowd.current[i] = el;
				},
				mats,
				geos,
				shirt: mats.crowd[c.shirt] ?? mats.dark,
				skin: i % 2 ? mats.skin : mats.skin2,
				hasPhone: c.phone,
				scale: c.scale
			}, i)),
			Array.from({ length: 16 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				ref: (el) => {
					sparks.current[i] = el;
				},
				visible: false,
				material: mats.spark,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.05,
					.05,
					.05
				] })
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loop, {
				f0,
				f1,
				crowd,
				sparks
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaptureCanvas, {})
		]
	});
}
//#endregion
export { FightScene };
