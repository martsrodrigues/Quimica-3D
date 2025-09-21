// src/components/MoleculeViewer.jsx
import React, { useEffect, useRef } from 'react';
import * as NGL from 'ngl';

export default function MoleculeViewer({ compound }) {
  const stageRef = useRef(null);

  useEffect(() => {
    if (!stageRef.current) return;
    const stage = new NGL.Stage(stageRef.current);

    const loadStructure = async () => {
      try {
        await stage.removeAllComponents();
        const url = `/api/pubchem/sdf/${encodeURIComponent(compound)}`;
        const comp = await stage.loadFile(url, { ext: 'sdf' });
        comp.addRepresentation('ball+stick');
        comp.autoView();
      } catch (err) {
        console.error('Erro ao carregar estrutura:', err);
      }
    };

    loadStructure();

    const handleResize = () => stage.handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      stage.dispose();
    };
  }, [compound]);

  return <div ref={stageRef} style={{ width: '100%', height: '100%' }} />;
}