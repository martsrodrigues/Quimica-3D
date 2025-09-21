// src/components/ThreeModels.jsx
import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const modelURLs = {
  BrainStem: 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/BrainStem/glTF/BrainStem.gltf',
  Avocado: 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Avocado/glTF/Avocado.gltf',
  Brain: 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Brain/glTF/Brain.gltf',
  Heart: 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Heart/glTF/Heart.gltf',
  Leaf: 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Plant/glTF/Plant.gltf'
};

function Model({ url }) {
  const { scene } = useGLTF(url, true);
  return <primitive object={scene} />;
}

export default function ThreeModels() {
  const [selectedModel, setSelectedModel] = useState('BrainStem');

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="model-select" style={{ marginRight: 8 }}>Seleciona Modelo:</label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          style={{ padding: 6, borderRadius: 4 }}
        >
          {Object.keys(modelURLs).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>

      <div style={{ width: '100%', height: '600px', border: '1px solid #ddd', borderRadius: 8 }}>
        <Canvas>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={0.6} />
          <Suspense fallback={null}>
            <Model url={modelURLs[selectedModel]} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}
