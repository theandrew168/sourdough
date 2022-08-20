import * as triangle from './app/triangle';
import * as box from './app/box';

// export each app entrypoint at the global scope
(globalThis as any).triangleMain = triangle.main;
(globalThis as any).boxMain = box.main;
