# 3D Models Directory

This directory contains 3D models for the car expo application.

## BMW M4 Competition Model

To use the 3D hero section, you need to add a BMW M4 Competition model in GLTF/GLB format:

1. Download a BMW M4 Competition model in GLTF or GLB format
2. Place it in this directory as `bmw-m4-competition.glb` or `bmw-m4-competition.gltf`
3. The model should include:
   - Car body mesh
   - Headlight meshes (named with "headlight" or "light" in the name)
   - Proper materials and textures

## Free Model Sources

- Sketchfab (with proper licensing)
- TurboSquid
- CGTrader
- Free3D

## Model Requirements

- Format: GLTF or GLB
- File size: Under 50MB for web performance
- Textures: Embedded or separate files
- Materials: PBR materials for realistic lighting
- Scale: Properly scaled (1 unit = 1 meter recommended)

## Fallback

If no model is available, the component will show a placeholder box geometry.
