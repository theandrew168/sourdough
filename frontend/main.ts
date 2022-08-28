import * as triangle from './app/triangle';
import * as square from './app/square';
import * as box from './app/box';
import * as materials from './app/materials';
import * as preview from './app/preview';

// export each app entrypoint at the global scope
(globalThis as any).triangle = triangle.main;
(globalThis as any).square = square.main;
(globalThis as any).box = box.main;
(globalThis as any).materials = materials.main;
(globalThis as any).preview = preview.main;
