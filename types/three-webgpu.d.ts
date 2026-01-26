// Type declarations for Three.js WebGPU and TSL modules
declare module 'three/webgpu' {
  export * from 'three';
  export class WebGPURenderer {
    constructor(parameters?: any);
    init(): Promise<void>;
    renderAsync(): Promise<void>;
    domElement: HTMLCanvasElement;
    setSize(width: number, height: number, updateStyle?: boolean): void;
    setPixelRatio(value: number): void;
    dispose(): void;
  }
  export class PostProcessing {
    constructor(renderer: any);
    outputNode: any;
    renderAsync(): Promise<void>;
  }
  export class MeshBasicNodeMaterial {
    constructor(parameters?: any);
    colorNode: any;
    transparent: boolean;
    opacity: number;
  }
  export namespace MathUtils {
    function lerp(x: number, y: number, t: number): number;
    function clamp(value: number, min: number, max: number): number;
  }
  export class Vector2 {
    constructor(x?: number, y?: number);
    x: number;
    y: number;
    set(x: number, y: number): this;
  }
}

declare module 'three/tsl' {
  export function abs(node: any): any;
  export function blendScreen(a: any, b: any): any;
  export function float(value: number | any): any;
  export function mod(a: any, b: any): any;
  export function mx_cell_noise_float(uv: any): any;
  export function oneMinus(node: any): any;
  export function smoothstep(edge0: number | any, edge1: number | any, x: any): any;
  export function texture(tex: any, uv?: any): any;
  export function uniform(value: any): any;
  export function uv(): any;
  export function vec2(x: any, y?: any): any;
  export function vec3(x: any, y?: any, z?: any): any;
  export function pass(scene: any, camera: any): any;
  export function mix(a: any, b: any, t: any): any;
  export function add(a: any, b: any): any;
}

declare module 'three/examples/jsm/tsl/display/BloomNode.js' {
  export function bloom(input: any, strength?: number, radius?: number, threshold?: number): any;
}
