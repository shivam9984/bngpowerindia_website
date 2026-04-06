'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { SERVICE_DEFINITIONS } from '@/lib/applications/config'
import { useApplications } from '@/lib/applications/context'
import { DEV_MOCK_ENABLED } from '@/lib/auth/dev-mock'
import { useRBAC } from '@/lib/rbac/use-rbac'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart3,
  Ban,
  Printer,
  Search,
  Shield,
  Trash2,
  UserPlus,
} from 'lucide-react'

function formatDateTime(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  const yyyy = d.getUTCFullYear()
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const min = String(d.getUTCMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${min} UTC`
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function titleFromKey(key) {
  return String(key || '')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

const PRINT_COLORS = {
  primary: '#4a7c8b',
  darkPrimary: '#2d5069',
  lightPrimary: '#f0f8fc',
  accent: '#d4a574',
  accentGreen: '#7cb342',
  text: '#1a1a1a',
  textLight: '#5a6b7a',
  textMuted: '#8a95a5',
  border: '#dfe5eb',
  background: '#ffffff',
  dark: '#1f2937',
}

function statusBadgeStyle(status) {
  const map = {
    'Under Review': { bg: '#FFF7E6', color: '#B45309', border: '#FDE68A' },
    Approved: { bg: PRINT_COLORS.lightPrimary, color: PRINT_COLORS.primary, border: '#BBF7D0' },
    Rejected: { bg: '#FFF1F2', color: '#9F1239', border: '#FECDD3' },
    Submitted: { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
    Success: { bg: PRINT_COLORS.lightPrimary, color: PRINT_COLORS.primary, border: '#BBF7D0' },
    'In Progress': { bg: '#F5F3FF', color: '#5B21B6', border: '#DDD6FE' },
    pending: { bg: '#FFF7E6', color: '#B45309', border: '#FDE68A' },
    paid: { bg: PRINT_COLORS.lightPrimary, color: PRINT_COLORS.primary, border: '#BBF7D0' },
    unpaid: { bg: '#FFF1F2', color: '#9F1239', border: '#FECDD3' },
    in_review: { bg: '#FFF7E6', color: '#B45309', border: '#FDE68A' },
    approved: { bg: PRINT_COLORS.lightPrimary, color: PRINT_COLORS.primary, border: '#BBF7D0' },
    rejected: { bg: '#FFF1F2', color: '#9F1239', border: '#FECDD3' },
    submitted: { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  }

  const raw = String(status || '').trim()
  const key = raw.toLowerCase().replaceAll(' ', '_')
  const title = titleFromKey(key)
  const s = map[raw] || map[key] || map[title] || map.Submitted
  return `background:${s.bg};color:${s.color};border:1px solid ${s.border};padding:4px 12px;border-radius:6px;font-size:11px;font-weight:700;letter-spacing:0.05em;display:inline-block;text-transform:uppercase;`
}

function formatDateLong(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const day = String(d.getUTCDate()).padStart(2, '0')
  const month = months[d.getUTCMonth()] || '—'
  const year = d.getUTCFullYear()
  return `${day} ${month} ${year}`
}

function buildPrintHtml(app) {
  const payload = app?.payload || {}
  const applicantEmail = app?.submittedByEmail || payload?.email || '—'
  const applicantName = app?.submittedByName || payload?.profile_snapshot?.full_name || '—'
  const profile = payload?.profile_snapshot || {}

  const company = {
    name: 'BNGPower India Private Limited',
    tagline: "Powering India's Energy Future",
    address: 'Gurugram, Haryana - 122015',
    phone: '+91 9151141423',
    email: 'info@bngpowerindia.com',
    website: 'www.bngpowerindia.com',
    cin: '—',
    gstin: '—',
    logoUrl: '/bng-logo.png',
  }

  const document = {
    subtitle: `Application for ${escapeHtml(app?.serviceLabel || 'Service')}`,
    refNo: escapeHtml(app?.id || '—'),
    date: escapeHtml(formatDateLong(app?.submittedAt)),
    status: escapeHtml(titleFromKey(app?.status || 'Submitted')),
  }
  const documentYear = String(app?.submittedAt || '').slice(0, 4) || '—'

  const applicant = {
    fullname: profile?.full_name || applicantName,
    email: profile?.email || applicantEmail,
    contact_no: profile?.contact_no || '—',
    alternate_contact_no: profile?.alternate_contact_no || '—',
    occupation: profile?.occupation || '—',
    aadhaar_number: profile?.aadhaar_number_masked || '—',
    pan_number: profile?.pan_number_masked || '—',
    full_address: [profile?.address?.full_address || payload?.full_address, profile?.address?.district || payload?.district, profile?.address?.state || payload?.state]
      .filter(Boolean)
      .join(', ') || '—',
    state: profile?.address?.state || payload?.state || '—',
    district: profile?.address?.district || payload?.district || '—',
    pincode: profile?.address?.pincode || payload?.pincode || '—',
    photoUrl: null,
  }

  const addressLine = [
    profile?.address?.full_address || payload?.full_address,
    profile?.address?.district || payload?.district,
    profile?.address?.state || payload?.state,
    profile?.address?.pincode || payload?.pincode,
  ]
    .filter(Boolean)
    .join(', ')

  const mapsPin = payload?.google_maps_pin || payload?.coordinates || payload?.map_pin || '—'

  const request = {
    productType: escapeHtml(app?.serviceLabel || '—'),
    companyName: escapeHtml(payload?.fuel_company_name || payload?.companyName || '—'),
    landType: escapeHtml(payload?.land_type || '—'),
    location: escapeHtml(addressLine || '—'),
    landmark: escapeHtml(payload?.landmark || '—'),
    khasraNo: escapeHtml(payload?.khasra_no || '—'),
    roadType: escapeHtml(payload?.road_type || '—'),
    roadWidth: escapeHtml(payload?.road_width_mt ? `${payload.road_width_mt} mt` : '—'),
    rearDepth: escapeHtml(payload?.rear_depth_mt ? `${payload.rear_depth_mt} mt` : '—'),
    lhsDepth: escapeHtml(payload?.lhs_depth_mt ? `${payload.lhs_depth_mt} mt` : '—'),
    rhsDepth: escapeHtml(payload?.rhs_depth_mt ? `${payload.rhs_depth_mt} mt` : '—'),
    coordinates: escapeHtml(mapsPin || '—'),
  }

  const terms = [
    'This application is submitted by the applicant for consideration by BNGPower India Private Limited.',
    'The applicant declares that all information provided is true, accurate, and complete to the best of their knowledge.',
    'All documents submitted must be original or certified copies as per applicable regulations.',
    'BNGPower India Private Limited reserves the right to verify information and conduct site inspections.',
    'The applicant shall comply with all applicable central, state, and local government regulations and norms.',
    'Any false or misleading information may lead to immediate rejection of the application.',
    'The applicant agrees to be bound by the terms and conditions set forth by BNGPower India Private Limited.',
    'For further clarification, contact our support team at info@bngpowerindia.com or call +91 9151141423.',
  ]

  const colors = PRINT_COLORS

  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${escapeHtml(document.subtitle)}</title>
      <style>
        *{box-sizing:border-box}
        body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background:#f3f4f6;}
        .wrap{min-height:100vh;padding:20px 16px;display:flex;justify-content:center;}
        .sheet{width:100%;max-width:800px;background:${colors.background};box-shadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -2px rgba(0,0,0,0.1);overflow:hidden;}
        .header{background:linear-gradient(135deg, ${colors.darkPrimary} 0%, ${colors.primary} 100%);padding:24px 40px;color:#fff;}
        .row{display:flex;align-items:center;gap:24px;margin-bottom:18px;}
        .logo{flex-shrink:0}
        .logo img{width:80px;height:80px;object-fit:contain}
        .company h1{margin:0 0 3px 0;font-size:24px;font-weight:900;color:#fff;letter-spacing:-0.01em}
        .company p{margin:0 0 10px 0;font-size:11px;color:rgba(255,255,255,0.85);font-weight:600}
        .meta{font-size:9px;color:rgba(255,255,255,0.75);line-height:1.6}
        .reg{display:flex;gap:32px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.2);font-size:9px;color:rgba(255,255,255,0.7)}
        .reg .k{display:block;color:rgba(255,255,255,0.6);margin-bottom:2px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;font-size:8px}
        .reg .v{color:#fff;font-weight:600;font-family:monospace;font-size:9px}
        .doc-title{background:#f9fafb;border-bottom:1px solid ${colors.border};padding:18px 40px;display:flex;align-items:center;justify-content:space-between;gap:20px}
        .doc-title h2{margin:0 0 4px 0;font-size:13px;font-weight:800;color:${colors.text};text-transform:uppercase;letter-spacing:0.12em}
        .doc-title p{margin:0;font-size:10px;color:${colors.textLight}}
        .content{padding:24px 40px 28px}
        .sec-title{margin-bottom:16px;margin-top:24px}
        .sec-title .bar{width:4px;height:20px;background:${colors.primary};border-radius:2px}
        .sec-title h3{margin:0;font-size:12px;font-weight:800;color:${colors.text};text-transform:uppercase;letter-spacing:0.15em}
        .sec-title .line{height:1px;background:${colors.border};margin-top:10px}
        .sec-head{display:flex;align-items:center;gap:8px}
        .grid2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px 24px}
        .field{display:flex;flex-direction:column;gap:6px}
        .label{font-size:10px;color:${colors.textMuted};font-weight:700;text-transform:uppercase;letter-spacing:0.12em}
        .value{font-size:13px;color:${colors.text};font-weight:500;border-bottom:1.5px solid ${colors.border};padding-bottom:6px}
        .photo{width:110px;height:140px;border:2px solid ${colors.border};border-radius:6px;background:#ffffff;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;overflow:hidden}
        .photo-note{font-size:8px;color:${colors.textMuted};text-transform:uppercase;letter-spacing:0.08em;font-weight:600;text-align:center}
        .terms{background:linear-gradient(135deg, ${colors.lightPrimary} 0%, #f5f9fc 100%);padding:24px 40px;border-top:2px solid ${colors.primary}}
        .terms .t{font-size:9.5px;font-weight:800;color:${colors.primary};text-transform:uppercase;letter-spacing:0.15em;margin-bottom:12px}
        .terms ol{margin:0 0 0 18px;padding-left:0;display:flex;flex-direction:column;gap:5px}
        .terms li{font-size:9px;color:${colors.textLight};line-height:1.6;font-weight:400}
        .footer{border-top:1px solid ${colors.border};padding-top:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;font-size:8.5px}
        .ref{font-family:monospace;color:${colors.primary};font-weight:600;background:rgba(74,124,139,0.08);padding:3px 8px;border-radius:4px}
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="sheet">
          <div class="header">
            <div class="row">
              <div class="logo">
                <img src="${escapeHtml(company.logoUrl)}" alt="${escapeHtml(company.name)}" />
              </div>
              <div class="company" style="flex:1;">
                <h1>${escapeHtml(company.name)}</h1>
                <p>${escapeHtml(company.tagline)}</p>
                <div class="meta">
                  <div>${escapeHtml(company.address)}</div>
                  <div style="margin-top:4px;">
                    <span>Tel: ${escapeHtml(company.phone)}</span>
                    <span style="margin:0 6px;color:rgba(255,255,255,0.5)">|</span>
                    <span>${escapeHtml(company.email)}</span>
                    <span style="margin:0 6px;color:rgba(255,255,255,0.5)">|</span>
                    <span>${escapeHtml(company.website)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="reg">
              <div>
                <span class="k">CIN</span>
                <span class="v">${escapeHtml(company.cin)}</span>
              </div>
              <div>
                <span class="k">GSTIN</span>
                <span class="v">${escapeHtml(company.gstin)}</span>
              </div>
            </div>
          </div>

          <div class="doc-title">
            <div>
              <h2>Service Request Form</h2>
              <p>${escapeHtml(document.subtitle)}</p>
            </div>
            <div style="text-align:right;flex-shrink:0;">
              <div style="font-size:9.5px;color:${colors.textLight};margin-bottom:4px;">
                REF:&nbsp;<span style="font-family:monospace;font-weight:700;color:${colors.text};">${escapeHtml(document.refNo)}</span>
              </div>
              <div style="display:flex;gap:8px;align-items:center;justify-content:flex-end;">
                <span style="font-size:9px;color:${colors.textMuted};">${escapeHtml(document.date)}</span>
                <span style="${statusBadgeStyle(document.status)}">${escapeHtml(document.status)}</span>
              </div>
            </div>
          </div>

          <div class="content">
            <div class="sec-title">
              <div class="sec-head">
                <div class="bar"></div>
                <h3>Applicant Profile Details</h3>
              </div>
              <div class="line"></div>
            </div>

            <div style="display:flex;gap:28px;align-items:flex-start;">
              <div style="flex:1;">
                <div class="grid2">
                  ${[
                    ['Full Name', applicant.fullname],
                    ['Email Address', applicant.email],
                    ['Contact No. (Required)', applicant.contact_no],
                    ['Alternate Contact No.', applicant.alternate_contact_no || '—'],
                    ['Occupation', applicant.occupation],
                    ['Aadhaar Number (Masked)', applicant.aadhaar_number],
                    ['PAN Number (Masked)', applicant.pan_number],
                  ]
                    .map(
                      ([label, value]) => `
                    <div class="field">
                      <span class="label">${escapeHtml(label)}</span>
                      <span class="value">${escapeHtml(value || '—')}</span>
                    </div>`,
                    )
                    .join('')}
                </div>
              </div>
              <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:8px;">
                <div class="photo">
                  <div style="font-size:9px;color:${colors.textMuted};font-weight:800;text-transform:uppercase;letter-spacing:0.08em;text-align:center;line-height:1.35;padding:0 10px;">
                    Applicant Photo<br/> (Attested)
                  </div>
                </div>
                <span class="photo-note">Attach photo here</span>
              </div>
            </div>

            <div style="margin-bottom:20px;">
              <div style="margin-bottom:12px;">
                <span class="label">Full Address</span>
                <div class="value" style="margin-top:6px;">${escapeHtml(applicant.full_address || '—')}</div>
              </div>
              <div class="grid2">
                ${[
                  ['State', applicant.state],
                  ['District', applicant.district],
                  ['Pincode', applicant.pincode],
                ]
                  .map(
                    ([label, value]) => `
                  <div class="field">
                    <span class="label">${escapeHtml(label)}</span>
                    <span class="value">${escapeHtml(value || '—')}</span>
                  </div>`,
                  )
                  .join('')}
              </div>
            </div>
          </div>

          <div class="content" style="padding-top:4px;">
            <div class="sec-title">
              <div class="sec-head">
                <div class="bar"></div>
                <h3>Requested Service Details</h3>
              </div>
              <div class="line"></div>
            </div>

            <div class="grid2">
              ${[
                ['Business Type', request.productType],
                ['Company Name', request.companyName],
                ['Land Type', request.landType],
                ['Road Type', request.roadType],
                ['Road Width', request.roadWidth],
                ['Khasra No.', request.khasraNo],
                ['Coordinates', request.coordinates],
                ['Rear Depth', request.rearDepth],
                ['LHS Depth', request.lhsDepth],
                ['RHS Depth', request.rhsDepth],
                ['Applicant', applicantName],
              ]
                .map(
                  ([label, value]) => `
                <div class="field">
                  <span class="label">${escapeHtml(label)}</span>
                  <span class="value">${escapeHtml(value || '—')}</span>
                </div>`,
                )
                .join('')}
            </div>

            <div style="margin-top:16px;padding:12px 14px;background:#f9fafb;border-radius:6px;border:1px solid ${colors.border};">
              <div class="label" style="margin-bottom:6px;">Location</div>
              <div style="font-size:12px;color:${colors.text};font-weight:500;">
                ${escapeHtml(request.location || '—')}
                <div style="color:${colors.textLight};margin-top:4px;font-size:11px;">Landmark: ${escapeHtml(request.landmark || '—')}</div>
              </div>
            </div>
          </div>

          <div class="terms">
            <div class="t">Terms & Conditions</div>
            <ol>
              ${terms.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}
            </ol>
            <div class="footer">
              <div style="color:${colors.textMuted};font-weight:500;">© ${escapeHtml(documentYear)} ${escapeHtml(company.name)}. All rights reserved.</div>
              <div class="ref">${escapeHtml(document.refNo)}</div>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>`
  return html
}

const DUMMY_APPLICATIONS = [
  {
    id: 'SR-20260330-0001',
    serviceKey: 'fuel_station',
    serviceLabel: 'Fuel Station',
    status: 'submitted',
    paymentStatus: 'paid',
    submittedAt: '2026-03-30T09:35:00.000Z',
    submittedByUserId: 'user_001',
    submittedByName: 'Shivam Rai',
    submittedByEmail: 'applicant1@dev.local',
    payload: {
      profile_snapshot: {
        user_id: 'user_001',
        email: 'applicant1@dev.local',
        full_name: 'Shivam Rai',
        contact_no: '9151141423',
        alternate_contact_no: '9876543210',
        occupation: 'Business',
        aadhaar_number_masked: 'XXXX-XXXX-1234',
        pan_number_masked: 'ABXXX1234F',
        address: {
          full_address: 'Gomti Nagar, Lucknow',
          district: 'Lucknow',
          state: 'Uttar Pradesh',
          pincode: '226010',
        },
      },
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      pincode: '226010',
      full_address: 'Gomti Nagar, Lucknow',
      google_maps_pin: 'https://maps.google.com/?q=26.8467,80.9462',
      landmark: 'Near metro station',
      fuel_company_name: 'IOCL',
      land_type: 'Owned',
      rear_depth_mt: '45.50',
      lhs_depth_mt: '30.00',
      rhs_depth_mt: '30.00',
      khasra_no: '123/4A',
      road_type: 'National Highway',
      road_width_mt: '12.00',
      email: 'applicant1@dev.local',
    },
  },
  {
    id: 'SR-20260329-0007',
    serviceKey: 'cbg_plant',
    serviceLabel: 'CBG Plant',
    status: 'in_review',
    paymentStatus: 'pending',
    submittedAt: '2026-03-29T18:10:00.000Z',
    submittedByUserId: 'user_002',
    submittedByName: 'Aditi Sharma',
    submittedByEmail: 'applicant2@dev.local',
    payload: {
      profile_snapshot: {
        user_id: 'user_002',
        email: 'applicant2@dev.local',
        full_name: 'Aditi Sharma',
        contact_no: '9999999999',
        alternate_contact_no: null,
        occupation: 'Entrepreneur',
        aadhaar_number_masked: 'XXXX-XXXX-4321',
        pan_number_masked: 'ADXXX6789P',
        address: {
          full_address: 'Shivaji Nagar, Pune',
          district: 'Pune',
          state: 'Maharashtra',
          pincode: '411001',
        },
      },
      state: 'Maharashtra',
      district: 'Pune',
      pincode: '411001',
      full_address: 'Shivaji Nagar, Pune',
      google_maps_pin: 'https://maps.google.com/?q=18.5204,73.8567',
      email: 'applicant2@dev.local',
    },
  },
  {
    id: 'SR-20260328-0013',
    serviceKey: 'biodiesel',
    serviceLabel: 'Biodiesel',
    status: 'submitted',
    paymentStatus: 'unpaid',
    submittedAt: '2026-03-28T22:40:00.000Z',
    submittedByUserId: 'user_003',
    submittedByName: 'Rahul Verma',
    submittedByEmail: 'applicant3@dev.local',
    payload: {
      profile_snapshot: {
        user_id: 'user_003',
        email: 'applicant3@dev.local',
        full_name: 'Rahul Verma',
        contact_no: '8888888888',
        alternate_contact_no: null,
        occupation: 'Consultant',
        aadhaar_number_masked: 'XXXX-XXXX-2468',
        pan_number_masked: 'RAXXX1122K',
        address: {
          full_address: 'Navrangpura, Ahmedabad',
          district: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380001',
        },
      },
      state: 'Gujarat',
      district: 'Ahmedabad',
      pincode: '380001',
      full_address: 'Navrangpura, Ahmedabad',
      google_maps_pin: 'https://maps.google.com/?q=23.0225,72.5714',
      email: 'applicant3@dev.local',
    },
  },
  {
    id: 'SR-20260327-0004',
    serviceKey: 'ev_charging_station',
    serviceLabel: 'EV Charging Station',
    status: 'approved',
    paymentStatus: 'paid',
    submittedAt: '2026-03-27T20:05:00.000Z',
    submittedByUserId: 'user_004',
    submittedByName: 'Neha Singh',
    submittedByEmail: 'applicant4@dev.local',
    payload: {
      profile_snapshot: {
        user_id: 'user_004',
        email: 'applicant4@dev.local',
        full_name: 'Neha Singh',
        contact_no: '7777777777',
        alternate_contact_no: null,
        occupation: 'Owner',
        aadhaar_number_masked: 'XXXX-XXXX-7788',
        pan_number_masked: 'NEXXX3344N',
        address: {
          full_address: 'Salt Lake, Kolkata',
          district: 'Kolkata',
          state: 'West Bengal',
          pincode: '700091',
        },
      },
      state: 'West Bengal',
      district: 'Kolkata',
      pincode: '700091',
      full_address: 'Salt Lake, Kolkata',
      google_maps_pin: 'https://maps.google.com/?q=22.5726,88.3639',
      email: 'applicant4@dev.local',
    },
  },
  {
    id: 'SR-20260327-0009',
    serviceKey: 'fuel_station',
    serviceLabel: 'Fuel Station',
    status: 'approved',
    paymentStatus: 'paid',
    submittedAt: '2026-03-27T02:15:00.000Z',
    submittedByUserId: 'user_005',
    submittedByName: 'Vikas Kumar',
    submittedByEmail: 'applicant5@dev.local',
    payload: {
      profile_snapshot: {
        user_id: 'user_005',
        email: 'applicant5@dev.local',
        full_name: 'Vikas Kumar',
        contact_no: '7666666666',
        alternate_contact_no: null,
        occupation: 'Dealer',
        aadhaar_number_masked: 'XXXX-XXXX-8899',
        pan_number_masked: 'VIXYY2233V',
        address: {
          full_address: 'Sector 29, Gurugram',
          district: 'Gurugram',
          state: 'Haryana',
          pincode: '122001',
        },
      },
      state: 'Haryana',
      district: 'Gurugram',
      pincode: '122001',
      full_address: 'Sector 29, Gurugram',
      google_maps_pin: 'https://maps.google.com/?q=28.4595,77.0266',
      fuel_company_name: 'HMEL',
      land_type: 'Owned',
      rear_depth_mt: '52.00',
      lhs_depth_mt: '35.00',
      rhs_depth_mt: '35.00',
      khasra_no: '88/7',
      road_type: 'City Road',
      road_width_mt: '14.00',
      email: 'applicant5@dev.local',
    },
  },
  {
    id: 'SR-20260326-0004',
    serviceKey: 'biodiesel',
    serviceLabel: 'Biodiesel',
    status: 'in_review',
    paymentStatus: 'pending',
    submittedAt: '2026-03-26T06:35:00.000Z',
    submittedByUserId: 'user_006',
    submittedByName: 'Sanjay Gupta',
    submittedByEmail: 'applicant6@dev.local',
    payload: {
      profile_snapshot: {
        user_id: 'user_006',
        email: 'applicant6@dev.local',
        full_name: 'Sanjay Gupta',
        contact_no: '7444444444',
        alternate_contact_no: null,
        occupation: 'Engineer',
        aadhaar_number_masked: 'XXXX-XXXX-9090',
        pan_number_masked: 'SAXXX5566S',
        address: {
          full_address: 'MG Road, Bengaluru',
          district: 'Bengaluru Urban',
          state: 'Karnataka',
          pincode: '560001',
        },
      },
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      pincode: '560001',
      full_address: 'MG Road, Bengaluru',
      google_maps_pin: 'https://maps.google.com/?q=12.9716,77.5946',
      email: 'applicant6@dev.local',
    },
  },
  {
    id: 'SR-20260325-0002',
    serviceKey: 'fuel_station',
    serviceLabel: 'Fuel Station',
    status: 'submitted',
    paymentStatus: 'unpaid',
    submittedAt: '2026-03-25T08:20:00.000Z',
    submittedByUserId: 'user_007',
    submittedByName: 'Pranav Patel',
    submittedByEmail: 'applicant7@dev.local',
    payload: {
      profile_snapshot: {
        user_id: 'user_007',
        email: 'applicant7@dev.local',
        full_name: 'Pranav Patel',
        contact_no: '7555555555',
        alternate_contact_no: null,
        occupation: 'Owner',
        aadhaar_number_masked: 'XXXX-XXXX-2121',
        pan_number_masked: 'PRXXX1234P',
        address: {
          full_address: 'Vijay Nagar, Indore',
          district: 'Indore',
          state: 'Madhya Pradesh',
          pincode: '452001',
        },
      },
      state: 'Madhya Pradesh',
      district: 'Indore',
      pincode: '452001',
      full_address: 'Vijay Nagar, Indore',
      google_maps_pin: 'https://maps.google.com/?q=22.7196,75.8577',
      email: 'applicant7@dev.local',
    },
  },
  {
    id: 'SR-20260324-0019',
    serviceKey: 'cbg_plant',
    serviceLabel: 'CBG Plant',
    status: 'submitted',
    paymentStatus: 'paid',
    submittedAt: '2026-03-24T04:50:00.000Z',
    submittedByUserId: 'user_008',
    submittedByName: 'Sneha Iyer',
    submittedByEmail: 'applicant8@dev.local',
    payload: {
      profile_snapshot: {
        user_id: 'user_008',
        email: 'applicant8@dev.local',
        full_name: 'Sneha Iyer',
        contact_no: '7111111111',
        alternate_contact_no: null,
        occupation: 'Developer',
        aadhaar_number_masked: 'XXXX-XXXX-3030',
        pan_number_masked: 'SNXXX7788T',
        address: {
          full_address: 'Gachibowli, Hyderabad',
          district: 'Hyderabad',
          state: 'Telangana',
          pincode: '500033',
        },
      },
      state: 'Telangana',
      district: 'Hyderabad',
      pincode: '500033',
      full_address: 'Gachibowli, Hyderabad',
      google_maps_pin: 'https://maps.google.com/?q=17.3850,78.4867',
      email: 'applicant8@dev.local',
    },
  },
]

const DUMMY_USERS = [
  { id: 'user_001', name: 'Shivam Rai', email: 'applicant1@dev.local', role: 'applicant', blocked: false, createdAt: '2026-03-20T10:10:00.000Z' },
  { id: 'user_002', name: 'Aditi Sharma', email: 'applicant2@dev.local', role: 'applicant', blocked: false, createdAt: '2026-03-20T10:15:00.000Z' },
  { id: 'user_003', name: 'Rahul Verma', email: 'applicant3@dev.local', role: 'applicant', blocked: true, createdAt: '2026-03-20T10:20:00.000Z' },
  { id: 'user_004', name: 'Neha Singh', email: 'applicant4@dev.local', role: 'applicant', blocked: false, createdAt: '2026-03-20T10:25:00.000Z' },
  { id: 'user_005', name: 'Vikas Kumar', email: 'manager1@dev.local', role: 'manager', blocked: false, createdAt: '2026-03-18T08:00:00.000Z' },
  { id: 'user_006', name: 'Sanjay Gupta', email: 'manager2@dev.local', role: 'manager', blocked: false, createdAt: '2026-03-18T08:05:00.000Z' },
  { id: 'user_007', name: 'Pranav Patel', email: 'support1@dev.local', role: 'manager', blocked: true, createdAt: '2026-03-18T08:10:00.000Z' },
  { id: 'user_008', name: 'Sneha Iyer', email: 'admin1@dev.local', role: 'admin', blocked: false, createdAt: '2026-03-10T09:00:00.000Z' },
  { id: 'user_009', name: 'Harshita Jain', email: 'admin2@dev.local', role: 'admin', blocked: false, createdAt: '2026-03-10T09:05:00.000Z' },
  { id: 'user_010', name: 'Ramesh Nair', email: 'applicant10@dev.local', role: 'applicant', blocked: false, createdAt: '2026-03-21T11:00:00.000Z' },
  { id: 'user_011', name: 'Kriti Mehta', email: 'applicant11@dev.local', role: 'applicant', blocked: false, createdAt: '2026-03-21T11:10:00.000Z' },
  { id: 'user_012', name: 'Faizan Ali', email: 'applicant12@dev.local', role: 'applicant', blocked: false, createdAt: '2026-03-21T11:15:00.000Z' },
]

export default function AdminDashboardPage() {
  const { email, role } = useRBAC()
  const { applications, loading } = useApplications()
  const [query, setQuery] = useState('')
  const [printOpen, setPrintOpen] = useState(false)
  const [printApp, setPrintApp] = useState(null)
  const printFrameRef = useRef(null)

  const [userQuery, setUserQuery] = useState('')
  const [users, setUsers] = useState(() => (DEV_MOCK_ENABLED ? DUMMY_USERS : DUMMY_USERS))
  const [createOpen, setCreateOpen] = useState(false)
  const [createError, setCreateError] = useState('')
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'applicant' })
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState(null)

  return (
    <div className="py-6 md:py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">Admin workspace</p>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                System administration
              </h1>
              <p className="text-muted-foreground mt-2">
                {email ? (
                  <>
                    Signed in as <span className="text-foreground font-medium">{email}</span>
                    {role ? (
                      <>
                        {' '}
                        · Role: <span className="capitalize">{role}</span>
                      </>
                    ) : null}
                  </>
                ) : (
                  'Manage submissions, users, and system-wide configuration.'
                )}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild variant="outline" className="gap-2">
                <Link href="/dashboard/reports">
                  <BarChart3 className="h-4 w-4" />
                  Reports
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <AdminSubmissionsSection
          loading={loading}
          applications={applications}
          query={query}
          setQuery={setQuery}
          printOpen={printOpen}
          setPrintOpen={setPrintOpen}
          printApp={printApp}
          setPrintApp={setPrintApp}
          printFrameRef={printFrameRef}
        />

        <AdminUsersSection
          users={users}
          setUsers={setUsers}
          userQuery={userQuery}
          setUserQuery={setUserQuery}
          createOpen={createOpen}
          setCreateOpen={setCreateOpen}
          createError={createError}
          setCreateError={setCreateError}
          newUser={newUser}
          setNewUser={setNewUser}
          deleteOpen={deleteOpen}
          setDeleteOpen={setDeleteOpen}
          deleteUserId={deleteUserId}
          setDeleteUserId={setDeleteUserId}
        />
      </div>

      <Dialog open={printOpen} onOpenChange={setPrintOpen}>
        <DialogContent className="sm:max-w-5xl w-full max-w-[calc(100%-2rem)] p-0 overflow-hidden">
          <div className="p-6 border-b border-border bg-background">
            <DialogHeader className="gap-1">
              <DialogTitle>Print preview</DialogTitle>
              <DialogDescription>Review the submitted form and click Print.</DialogDescription>
            </DialogHeader>
          </div>

          <div className="bg-muted/30">
            <iframe
              ref={printFrameRef}
              title="Print preview"
              srcDoc={printApp ? buildPrintHtml(printApp) : ''}
              className="w-full h-[70vh] bg-white"
            />
          </div>

          <div className="p-4 border-t border-border bg-background">
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPrintOpen(false)}>
                Close
              </Button>
              <Button
                type="button"
                className="gap-2"
                onClick={() => {
                  const w = printFrameRef.current?.contentWindow
                  if (!w) return
                  w.focus()
                  w.print()
                }}
                disabled={!printApp}
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Create new user
            </DialogTitle>
            <DialogDescription>Create a user for testing. Supabase integration can replace this later.</DialogDescription>
          </DialogHeader>

          {createError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {createError}
            </div>
          ) : null}

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Name</label>
              <Input
                value={newUser.name}
                onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))}
                placeholder="Full name"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                value={newUser.email}
                onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))}
                placeholder="user@example.com"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Role</label>
              <Select value={newUser.role} onValueChange={(v) => setNewUser((p) => ({ ...p, role: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applicant">Applicant</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                setCreateError('')
                const name = String(newUser.name || '').trim()
                const emailValue = String(newUser.email || '').trim().toLowerCase()
                const roleValue = String(newUser.role || '').trim()
                if (!name) return setCreateError('Name is required.')
                if (!emailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) return setCreateError('Enter a valid email address.')
                if (!['applicant', 'manager', 'admin'].includes(roleValue)) return setCreateError('Select a role.')
                if (users.some((u) => String(u.email).toLowerCase() === emailValue)) return setCreateError('A user with this email already exists.')
                const nextIndex = users.length + 1
                const id = `user_${String(nextIndex).padStart(3, '0')}`
                setUsers((prev) => [
                  { id, name, email: emailValue, role: roleValue, blocked: false, createdAt: new Date().toISOString() },
                  ...prev,
                ])
                setNewUser({ name: '', email: '', role: 'applicant' })
                setCreateOpen(false)
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete user
            </DialogTitle>
            <DialogDescription>This will remove the user from the local dummy list.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (!deleteUserId) return
                setUsers((prev) => prev.filter((u) => u.id !== deleteUserId))
                setDeleteUserId(null)
                setDeleteOpen(false)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AdminSubmissionsSection({
  loading,
  applications,
  query,
  setQuery,
  setPrintOpen,
  setPrintApp,
}) {
  const rows = useMemo(() => {
    if (DEV_MOCK_ENABLED && applications.length === 0) return DUMMY_APPLICATIONS
    return applications
  }, [applications])

  const serviceLabelByKey = useMemo(() => {
    const map = new Map()
    for (const s of SERVICE_DEFINITIONS) map.set(s.key, s.label)
    return map
  }, [])

  const stats = useMemo(() => {
    const counts = new Map()
    const applicants = new Set()
    for (const a of rows) {
      const key = a?.serviceKey || 'unknown'
      counts.set(key, (counts.get(key) || 0) + 1)
      const applicantEmail = a?.submittedByEmail || a?.payload?.email
      if (applicantEmail) applicants.add(String(applicantEmail).toLowerCase())
    }
    return { counts, applicantCount: applicants.size, total: rows.length }
  }, [rows])

  const filtered = useMemo(() => {
    const q = String(query || '').trim().toLowerCase()
    if (!q) return rows
    return rows.filter((a) => {
      const applicantEmail = (a?.submittedByEmail || a?.payload?.email || '').toLowerCase()
      const applicantName = String(a?.submittedByName || '').toLowerCase()
      const service = (a?.serviceLabel || serviceLabelByKey.get(a?.serviceKey) || '').toLowerCase()
      const state = String(a?.payload?.state || '').toLowerCase()
      const district = String(a?.payload?.district || '').toLowerCase()
      const pincode = String(a?.payload?.pincode || '').toLowerCase()
      const status = String(a?.status || '').toLowerCase()
      return (
        applicantEmail.includes(q) ||
        applicantName.includes(q) ||
        service.includes(q) ||
        state.includes(q) ||
        district.includes(q) ||
        pincode.includes(q) ||
        status.includes(q) ||
        String(a?.id || '').toLowerCase().includes(q)
      )
    })
  }, [rows, query, serviceLabelByKey])

  return (
    <>
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Submissions overview</h2>
            <p className="text-sm text-muted-foreground">Total forms submitted and category breakdown.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <Card className="border-border lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total forms submitted</CardTitle>
              <CardDescription>All services combined.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <p className="text-3xl font-bold text-foreground">{stats.total}</p>
              <Badge variant="secondary">{stats.applicantCount} applicants</Badge>
            </CardContent>
          </Card>

          {SERVICE_DEFINITIONS.map((s) => (
            <Card key={s.key} className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{s.label}</CardTitle>
                <CardDescription>Submitted</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{stats.counts.get(s.key) || 0}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">All submitted forms</h2>
            <p className="text-sm text-muted-foreground">Search, review and print a specific submission.</p>
          </div>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by email, service, state, district, pincode…"
              className="pl-9"
            />
          </div>
        </div>

        <Card className="border-border">
          <CardContent className="relative p-0">
            <LoadingOverlay open={loading && !DEV_MOCK_ENABLED} message="Loading submissions" />
            {loading && !DEV_MOCK_ENABLED ? (
              <div className="min-h-24" />
            ) : filtered.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">No submissions found.</div>
            ) : (
              <Table containerClassName="max-h-[520px] overflow-auto scrollbar-white">
                <TableHeader className="[&_tr]:border-b-2 [&_tr]:border-action/40">
                  <TableRow>
                    <TableHead className="sticky top-0 z-10 bg-primary text-primary-foreground font-semibold shadow-sm">
                      Service Request ID
                    </TableHead>
                    <TableHead className="sticky top-0 z-10 bg-primary text-primary-foreground font-semibold shadow-sm">
                      User ID
                    </TableHead>
                    <TableHead className="sticky top-0 z-10 bg-primary text-primary-foreground font-semibold shadow-sm">
                      Name
                    </TableHead>
                    <TableHead className="sticky top-0 z-10 bg-primary text-primary-foreground font-semibold shadow-sm">
                      Business type
                    </TableHead>
                    <TableHead className="sticky top-0 z-10 bg-primary text-primary-foreground font-semibold shadow-sm">
                      Payment status
                    </TableHead>
                    <TableHead className="sticky top-0 z-10 bg-primary text-primary-foreground font-semibold shadow-sm">
                      Submitted at
                    </TableHead>
                    <TableHead className="sticky top-0 z-10 bg-primary text-primary-foreground font-semibold text-right shadow-sm">
                      Print
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((a) => {
                    const serviceRequestId = a?.id || '—'
                    const userId = a?.submittedByUserId || '—'
                    const productType = a?.serviceLabel || serviceLabelByKey.get(a?.serviceKey) || '—'
                    const paymentStatus = a?.paymentStatus || 'unpaid'
                    const name = a?.submittedByName || '—'
                    return (
                      <TableRow key={a.id}>
                        <TableCell>
                          <span className="font-mono text-xs">{serviceRequestId}</span>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{userId}</TableCell>
                        <TableCell className="max-w-[220px] truncate" title={name}>
                          {name}
                        </TableCell>
                        <TableCell>{productType}</TableCell>
                        <TableCell>
                          <Badge variant={paymentStatus === 'paid' ? 'default' : 'secondary'} className="capitalize">
                            {paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDateTime(a.submittedAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => {
                              setPrintApp(a)
                              setPrintOpen(true)
                            }}
                          >
                            <Printer className="h-4 w-4" />
                            Print
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  )
}

function AdminUsersSection({
  users,
  setUsers,
  userQuery,
  setUserQuery,
  setCreateOpen,
  setCreateError,
  setNewUser,
  setDeleteOpen,
  setDeleteUserId,
}) {
  const filteredUsers = useMemo(() => {
    const q = String(userQuery || '').trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => {
      const name = String(u.name || '').toLowerCase()
      const email = String(u.email || '').toLowerCase()
      const role = String(u.role || '').toLowerCase()
      const id = String(u.id || '').toLowerCase()
      return name.includes(q) || email.includes(q) || role.includes(q) || id.includes(q)
    })
  }, [users, userQuery])

  const userStats = useMemo(() => {
    const byRole = new Map()
    let blocked = 0
    for (const u of users) {
      byRole.set(u.role, (byRole.get(u.role) || 0) + 1)
      if (u.blocked) blocked += 1
    }
    return { total: users.length, blocked, byRole }
  }, [users])

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Users operations</h2>
          <p className="text-sm text-muted-foreground">Create users, block/unblock, delete and search.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Search users by name, email, role…"
              className="pl-9"
            />
          </div>
          <Button
            type="button"
            className="gap-2"
            onClick={() => {
              setCreateError('')
              setNewUser({ name: '', email: '', role: 'applicant' })
              setCreateOpen(true)
            }}
          >
            <UserPlus className="h-4 w-4" />
            Create user
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Total users
            </CardTitle>
            <CardDescription>All roles combined.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <p className="text-3xl font-bold text-foreground">{userStats.total}</p>
            <Badge variant="secondary">{userStats.blocked} blocked</Badge>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Applicants</CardTitle>
            <CardDescription>Role: applicant</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{userStats.byRole.get('applicant') || 0}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Managers</CardTitle>
            <CardDescription>Role: manager</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{userStats.byRole.get('manager') || 0}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Admins</CardTitle>
            <CardDescription>Role: admin</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{userStats.byRole.get('admin') || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardContent className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">No users found.</div>
          ) : (
            <Table containerClassName="max-h-[520px] overflow-auto scrollbar-white">
              <TableHeader className="[&_tr]:border-b-2 [&_tr]:border-action/40">
                <TableRow>
                  <TableHead className="sticky top-0 z-10 bg-primary text-primary-foreground font-semibold shadow-sm">
                    User ID
                  </TableHead>
                  <TableHead className="sticky top-0 z-10 bg-primary text-primary-foreground font-semibold shadow-sm">
                    Name
                  </TableHead>
                  <TableHead className="sticky top-0 z-10 bg-primary text-primary-foreground font-semibold shadow-sm">
                    Email
                  </TableHead>
                  <TableHead className="sticky top-0 z-10 bg-primary text-primary-foreground font-semibold shadow-sm">
                    Role
                  </TableHead>
                  <TableHead className="sticky top-0 z-10 bg-primary text-primary-foreground font-semibold shadow-sm">
                    Status
                  </TableHead>
                  <TableHead className="sticky top-0 z-10 bg-primary text-primary-foreground font-semibold shadow-sm">
                    Created At
                  </TableHead>
                  <TableHead className="sticky top-0 z-10 bg-primary text-primary-foreground font-semibold text-right shadow-sm">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-mono text-xs">{u.id}</TableCell>
                    <TableCell className="max-w-[220px] truncate" title={u.name}>
                      {u.name}
                    </TableCell>
                    <TableCell className="max-w-[260px] truncate" title={u.email}>
                      <span className="font-mono text-xs">{u.email}</span>
                    </TableCell>
                    <TableCell className="capitalize">{u.role}</TableCell>
                    <TableCell>
                      <Badge variant={u.blocked ? 'destructive' : 'secondary'} className="capitalize">
                        {u.blocked ? 'blocked' : 'active'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(u.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, blocked: !x.blocked } : x)))}
                        >
                          <Ban className="h-4 w-4" />
                          {u.blocked ? 'Unblock' : 'Block'}
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="gap-2"
                          onClick={() => {
                            setDeleteUserId(u.id)
                            setDeleteOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
