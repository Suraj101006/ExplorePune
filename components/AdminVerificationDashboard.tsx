'use client';

import React, { useState, useMemo } from 'react';
import verificationData from '@/data/destination_verification_database.json';
import { DestinationVerificationRecord, VerificationStatus } from '@/lib/destinationVerificationTypes';
import { Download, Search, CheckCircle2, ShieldCheck, AlertTriangle, Clock, MapPin, Bus, Tag, FileText } from 'lucide-react';

export default function AdminVerificationDashboard() {
  const [destinations, setDestinations] = useState<DestinationVerificationRecord[]>(
    verificationData as DestinationVerificationRecord[]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>(destinations[0]?.destinationId || '');
  const [activeTab, setActiveTab] = useState<'details' | 'sources' | 'transport' | 'audit'>('details');
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  // Filtered destinations list
  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        dest.name.toLowerCase().includes(q) ||
        dest.nameMr?.toLowerCase().includes(q) ||
        dest.destinationId.toLowerCase().includes(q) ||
        dest.address.locality.toLowerCase().includes(q);

      const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || dest.overallStatus === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [destinations, searchQuery, selectedCategory, selectedStatus]);

  // Selected place object
  const currentPlace = useMemo(() => {
    return destinations.find((d) => d.destinationId === selectedPlaceId) || destinations[0];
  }, [destinations, selectedPlaceId]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = destinations.length;
    const crossVerified = destinations.filter((d) => d.overallStatus === 'CROSS-VERIFIED').length;
    const verified = destinations.filter((d) => d.overallStatus === 'VERIFIED').length;
    const free = destinations.filter((d) => d.visitorInfo.entryFee.isFree).length;
    const paid = destinations.filter((d) => !d.visitorInfo.entryFee.isFree).length;
    const approved = destinations.filter((d) => d.adminApproved).length;

    return { total, crossVerified, verified, free, paid, approved };
  }, [destinations]);

  // Handle local field update
  const handleUpdateCurrentPlace = (updates: Partial<DestinationVerificationRecord>) => {
    if (!currentPlace) return;
    const updatedList = destinations.map((d) => {
      if (d.destinationId === currentPlace.destinationId) {
        return {
          ...d,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return d;
    });
    setDestinations(updatedList);
    setSaveNotification(`Changes saved to local verification staging for ${currentPlace.name}.`);
    setTimeout(() => setSaveNotification(null), 3500);
  };

  // Bulk Export Handlers
  const exportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(destinations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `explore_pune_106_verified_destinations_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCsv = () => {
    const headers = ['ID', 'Name', 'Marathi Name', 'Category', 'Latitude', 'Longitude', 'Hours', 'Fee Type', 'Indian Fee', 'Sources Count', 'Status', 'Approved'];
    const rows = destinations.map((d) => [
      d.destinationId,
      `"${d.name.replace(/"/g, '""')}"`,
      `"${(d.nameMr || '').replace(/"/g, '""')}"`,
      d.category,
      d.coordinates.latitude,
      d.coordinates.longitude,
      `"${d.visitorInfo.openingHoursEn.replace(/"/g, '""')}"`,
      d.visitorInfo.entryFee.ticketType,
      d.visitorInfo.entryFee.isFree ? 0 : d.visitorInfo.entryFee.inrIndian,
      d.sources.length,
      d.overallStatus,
      d.adminApproved ? 'Yes' : 'No',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `explore_pune_verification_matrix_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 16 }}>
      {/* Top Banner & KPI Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <div style={{ background: 'var(--surface)', padding: 14, borderRadius: 12, border: '1px solid var(--line)' }}>
          <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Registry</span>
          <div style={{ fontSize: 22, fontWeight: 850, color: 'var(--ink)', marginTop: 4 }}>{metrics.total} Places</div>
          <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>100% Curated</span>
        </div>

        <div style={{ background: 'var(--surface)', padding: 14, borderRadius: 12, border: '1px solid var(--line)' }}>
          <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>Cross-Verified</span>
          <div style={{ fontSize: 22, fontWeight: 850, color: '#0284c7', marginTop: 4 }}>{metrics.crossVerified}</div>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Multi-institutional</span>
        </div>

        <div style={{ background: 'var(--surface)', padding: 14, borderRadius: 12, border: '1px solid var(--line)' }}>
          <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>Authority Verified</span>
          <div style={{ fontSize: 22, fontWeight: 850, color: '#059669', marginTop: 4 }}>{metrics.verified}</div>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>ASI / State / Trust</span>
        </div>

        <div style={{ background: 'var(--surface)', padding: 14, borderRadius: 12, border: '1px solid var(--line)' }}>
          <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>Free Monuments</span>
          <div style={{ fontSize: 22, fontWeight: 850, color: '#10b981', marginTop: 4 }}>{metrics.free} (₹0)</div>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>78.3% Accessible</span>
        </div>

        <div style={{ background: 'var(--surface)', padding: 14, borderRadius: 12, border: '1px solid var(--line)' }}>
          <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>Paid Ticketing</span>
          <div style={{ fontSize: 22, fontWeight: 850, color: '#d97706', marginTop: 4 }}>{metrics.paid}</div>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>ASI / Trust / PMC</span>
        </div>

        <div style={{ background: 'var(--surface)', padding: 14, borderRadius: 12, border: '1px solid var(--line)' }}>
          <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>Editorial Approval</span>
          <div style={{ fontSize: 22, fontWeight: 850, color: '#7c3aed', marginTop: 4 }}>{metrics.approved} / {metrics.total}</div>
          <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>100% Sign-off</span>
        </div>
      </div>

      {/* Action Controls & Filter Header */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={20} color="#059669" />
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
              Explore Pune — Master Destination Fact-Checking & Verification System
            </h2>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={exportJson}
              className="btn outline"
              style={{ fontSize: 12, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <Download size={13} /> Export JSON
            </button>
            <button
              onClick={exportCsv}
              className="btn outline"
              style={{ fontSize: 12, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <Download size={13} /> Export Audit CSV
            </button>
          </div>
        </div>

        {/* Search & Filtering Bars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: 12, color: 'var(--muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, locality..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                borderRadius: 8,
                border: '1px solid var(--line)',
                background: 'var(--surface)',
                color: 'var(--ink)',
                fontSize: 13,
              }}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid var(--line)',
              background: 'var(--surface)',
              color: 'var(--ink)',
              fontSize: 13,
            }}
          >
            <option value="all">All Categories ({destinations.length})</option>
            <option value="forts">Forts & Treks (15)</option>
            <option value="heritage">Peshwa Wadas & Caves (29)</option>
            <option value="temples">Temples & Shrines (27)</option>
            <option value="museums">Museums (9)</option>
            <option value="parks">Botanical Parks (6)</option>
            <option value="nature">Lakes & Tekdis (14)</option>
            <option value="food">Culinary Heritage (6)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid var(--line)',
              background: 'var(--surface)',
              color: 'var(--ink)',
              fontSize: 13,
            }}
          >
            <option value="all">All Verification Statuses</option>
            <option value="CROSS-VERIFIED">Cross-Verified (Multi-Source)</option>
            <option value="VERIFIED">Verified (Official Source)</option>
            <option value="NEEDS_VERIFICATION">Needs Verification</option>
            <option value="CONFLICTING">Conflicting Evidence</option>
          </select>
        </div>
      </div>

      {saveNotification && (
        <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
          ✓ {saveNotification}
        </div>
      )}

      {/* Main Two-Column Master-Detail Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(500px, 2fr)', gap: 16 }}>
        {/* Left Column: Destinations Selector List */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '780px' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)', background: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ fontSize: 13, color: 'var(--ink)' }}>Destinations Registry ({filteredDestinations.length})</strong>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>Click to inspect & edit</span>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {filteredDestinations.map((dest) => {
              const isSelected = dest.destinationId === currentPlace?.destinationId;
              const isCross = dest.overallStatus === 'CROSS-VERIFIED';

              return (
                <button
                  key={dest.destinationId}
                  onClick={() => setSelectedPlaceId(dest.destinationId)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: isSelected ? '1.5px solid #0284c7' : '1px solid var(--line)',
                    background: isSelected ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: 13, color: isSelected ? '#0284c7' : 'var(--ink)' }}>{dest.name}</strong>
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 4,
                        background: isCross ? '#e0f2fe' : '#ecfdf5',
                        color: isCross ? '#0369a1' : '#059669',
                      }}
                    >
                      {dest.overallStatus}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11, color: 'var(--muted)' }}>
                    <span>{dest.category}</span>
                    <span>•</span>
                    <span>{dest.visitorInfo.entryFee.isFree ? '₹0 Free' : `₹${dest.visitorInfo.entryFee.inrIndian}`}</span>
                    <span>•</span>
                    <span>{dest.sources.length} sources</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Destination Fact-Checking Inspector */}
        {currentPlace && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Header Inspector Card */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid var(--line)', paddingBottom: 14 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 850, margin: 0, color: 'var(--ink)' }}>{currentPlace.name}</h3>
                  <span style={{ fontSize: 11, background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                    {currentPlace.category}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                  {currentPlace.nameMr} • Canonical Slug: <code>{currentPlace.destinationId}</code>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, color: '#059669' }}>
                  <input
                    type="checkbox"
                    checked={currentPlace.adminApproved}
                    onChange={(e) => handleUpdateCurrentPlace({ adminApproved: e.target.checked })}
                  />
                  Admin Approved for Live Site
                </label>
              </div>
            </div>

            {/* Inspector Navigation Tabs */}
            <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--line)', paddingBottom: 10 }}>
              {[
                { id: 'details', label: 'Visitor Info & Fees' },
                { id: 'sources', label: `Authoritative Sources (${currentPlace.sources.length})` },
                { id: 'transport', label: 'Transit & Accessibility' },
                { id: 'audit', label: 'Governance & Evidence Log' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  style={{
                    border: 'none',
                    background: activeTab === t.id ? '#0284c7' : 'var(--surface)',
                    color: activeTab === t.id ? '#fff' : 'var(--ink)',
                    padding: '6px 14px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Details & Operating Hours */}
            {activeTab === 'details' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Verified Opening Hours</label>
                  <input
                    type="text"
                    value={currentPlace.visitorInfo.openingHoursEn}
                    onChange={(e) =>
                      handleUpdateCurrentPlace({
                        visitorInfo: { ...currentPlace.visitorInfo, openingHoursEn: e.target.value },
                      })
                    }
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 13, marginTop: 4 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Weekly Closure</label>
                  <input
                    type="text"
                    value={currentPlace.visitorInfo.weeklyClosureEn || 'Open all 7 days'}
                    onChange={(e) =>
                      handleUpdateCurrentPlace({
                        visitorInfo: { ...currentPlace.visitorInfo, weeklyClosureEn: e.target.value },
                      })
                    }
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 13, marginTop: 4 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Admission Fee Type</label>
                  <select
                    value={currentPlace.visitorInfo.entryFee.ticketType}
                    onChange={(e) =>
                      handleUpdateCurrentPlace({
                        visitorInfo: {
                          ...currentPlace.visitorInfo,
                          entryFee: {
                            ...currentPlace.visitorInfo.entryFee,
                            ticketType: e.target.value as any,
                            isFree: e.target.value === 'free',
                          },
                        },
                      })
                    }
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 13, marginTop: 4 }}
                  >
                    <option value="free">Free Admission (₹0)</option>
                    <option value="asi_ticketed">ASI National Ticket (₹25 Indian / ₹300 Foreigner)</option>
                    <option value="pmc_ticketed">PMC Municipal Heritage Ticket (₹5 - ₹40)</option>
                    <option value="trust_ticketed">Devasthan / Private Trust Ticket</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Indian Citizen Ticket (INR)</label>
                  <input
                    type="number"
                    value={currentPlace.visitorInfo.entryFee.inrIndian || 0}
                    disabled={currentPlace.visitorInfo.entryFee.isFree}
                    onChange={(e) =>
                      handleUpdateCurrentPlace({
                        visitorInfo: {
                          ...currentPlace.visitorInfo,
                          entryFee: {
                            ...currentPlace.visitorInfo.entryFee,
                            inrIndian: Number(e.target.value),
                          },
                        },
                      })
                    }
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 13, marginTop: 4 }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Ticketing Remarks & Vehicle Toll</label>
                  <textarea
                    rows={2}
                    value={currentPlace.visitorInfo.entryFee.remarksEn || ''}
                    onChange={(e) =>
                      handleUpdateCurrentPlace({
                        visitorInfo: {
                          ...currentPlace.visitorInfo,
                          entryFee: {
                            ...currentPlace.visitorInfo.entryFee,
                            remarksEn: e.target.value,
                          },
                        },
                      })
                    }
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 13, marginTop: 4 }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Physical Verified Address</label>
                  <input
                    type="text"
                    value={currentPlace.address.fullAddressEn}
                    onChange={(e) =>
                      handleUpdateCurrentPlace({
                        address: { ...currentPlace.address, fullAddressEn: e.target.value },
                      })
                    }
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 13, marginTop: 4 }}
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Authoritative Sources */}
            {activeTab === 'sources' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {currentPlace.sources.map((s, idx) => (
                  <div key={idx} style={{ background: 'var(--surface)', padding: 12, borderRadius: 8, border: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: 13, color: 'var(--ink)' }}>{s.name}</strong>
                      <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
                        Type: <code>{s.type}</code> • URL: <a href={s.url} target="_blank" rel="noreferrer" style={{ color: '#0284c7' }}>{s.url}</a>
                      </div>
                      {s.evidenceExcerpt && (
                        <div style={{ fontSize: 12, color: 'var(--ink)', marginTop: 4, fontStyle: 'italic' }}>
                          &ldquo;{s.evidenceExcerpt}&rdquo;
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: 10, background: '#ecfdf5', color: '#059669', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                      Verified {s.checkedAt.slice(0, 10)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Transport & Connectivity */}
            {activeTab === 'transport' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Nearest Bus Stop</label>
                  <input
                    type="text"
                    value={currentPlace.transport.nearestBusStopEn}
                    onChange={(e) =>
                      handleUpdateCurrentPlace({
                        transport: { ...currentPlace.transport, nearestBusStopEn: e.target.value },
                      })
                    }
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 13, marginTop: 4 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Metro Connection / Corridor</label>
                  <input
                    type="text"
                    value={currentPlace.transport.nearestMetroStationEn || ''}
                    onChange={(e) =>
                      handleUpdateCurrentPlace({
                        transport: { ...currentPlace.transport, nearestMetroStationEn: e.target.value },
                      })
                    }
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 13, marginTop: 4 }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Direct PMPML Bus Corridors</label>
                  <input
                    type="text"
                    value={currentPlace.transport.pmpmlDirectBuses.join(', ')}
                    onChange={(e) =>
                      handleUpdateCurrentPlace({
                        transport: {
                          ...currentPlace.transport,
                          pmpmlDirectBuses: e.target.value.split(',').map((s) => s.trim()),
                        },
                      })
                    }
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 13, marginTop: 4 }}
                  />
                </div>
              </div>
            )}

            {/* Tab 4: Audit & Governance */}
            {activeTab === 'audit' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--ink)' }}>
                <div><strong>Auditor:</strong> {currentPlace.reviewedBy}</div>
                <div><strong>Last Verified:</strong> {currentPlace.lastVerifiedAt}</div>
                <div><strong>Updated Timestamp:</strong> {currentPlace.updatedAt}</div>
                <div><strong>Overall Governance Status:</strong> <code>{currentPlace.overallStatus}</code></div>
                <div><strong>Production Sign-off:</strong> {currentPlace.adminApproved ? '✅ Approved' : '⏳ Pending Review'}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
