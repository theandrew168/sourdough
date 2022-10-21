import * as triangle from './app/triangle';
import * as square from './app/square';
import * as box from './app/box';
import * as materials from './app/materials';
import * as metal from './app/metal';
import * as skybox from './app/skybox';
import * as reflect from './app/reflect';
import * as forth from './app/forth';

// export each app entrypoint at the global scope
(globalThis as any).triangle = triangle.main;
(globalThis as any).square = square.main;
(globalThis as any).box = box.main;
(globalThis as any).materials = materials.main;
(globalThis as any).metal = metal.main;
(globalThis as any).skybox = skybox.main;
(globalThis as any).reflect = reflect.main;
(globalThis as any).forth = forth.main;
