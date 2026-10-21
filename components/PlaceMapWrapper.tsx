'use client';

import dynamicImport from 'next/dynamic';

const PlaceMapInternal = dynamicImport(() => import('@/components/PlaceMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '280px',
        borderRadius: '12px',
        backgroundColor: '#f5f5f4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#78716c',
        fontSize: '13px',
      }}
    >
      Loading Map...
    </div>
  ),
});

export default function PlaceMap(props: { latitude: number; longitude: number; name: string }) {
  return <PlaceMapInternal {...props} />;
}
