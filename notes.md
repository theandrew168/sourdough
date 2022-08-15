# notes
## Model Formats
* [OBJ](https://en.wikipedia.org/wiki/Wavefront_.obj_file)
* [COLLADA](https://en.wikipedia.org/wiki/COLLADA)
* [MD5](https://modwiki.dhewm3.org/MD5_(file_format))

## Model Attributes
* Position
* Texcoord
* Normal
* Bones (and other animation info)

## Model vs Mesh
A mesh is a single object of geometry.
A model may include multiple meshes, textures, materials, animations, etc.
Some model formats only support a subset of these features.

Given a model, you should be able to know:
* Which attributes are present (and in what order)
* Format of each attribute (size, type)
* Whether vertices are flat vs indexed

From that info, you can derive:
* Vertex stride (size of one complete vertex w/ all attribs)
* Vertex offset (how far into the vertex does each attrib start)
