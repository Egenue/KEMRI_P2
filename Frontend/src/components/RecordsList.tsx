import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Building2, 
  Edit3, 
  Eye, 
  UserPlus, 
  ShieldCheck, 
  UserRound, 
  ArrowUpDown, 
  Download, 
  Trash2,
  Calendar,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { DatabaseState, ScreeningRecord, EnrolmentRecord, DeliveryRecord, CloseoutRecord, UserRole } from '../types';
import { formatToDdmMmyyyy } from '../lib/dateUtils';

interface RecordsListProps {
  db: DatabaseState;
  onEditRecord: (table: 'screening' | 'enrolment' | 'delivery' | 'closeout', record: any) => void;
  onViewRecord: (table: 'screening' | 'enrolment' | 'delivery' | 'closeout', record: any) => void;
  userRole: UserRole;
  onDeleteRecord?: (table: 'screening' | 'enrolment' | 'delivery' | 'closeout', id: string) => void;
}

type ActiveTable = 'screening' | 'enrolment' | 'delivery' | 'closeout';

export default function RecordsList({ db, onEditRecord, onViewRecord, userRole, onDeleteRecord }: RecordsListProps) {
  const [activeTable, setActiveTable] = useState<ActiveTable>('screening');
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityFilter, setFacilityFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<string>('dateOfInterview');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Facilities
  const facilities = ['All', 'Bondo', 'Siaya', 'Kuoyo', 'Lumumba'];

  // Toggle Sorting
  const requestSort = (field: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortField === field && sortDirection === 'asc') {
      direction = 'desc';
    }
    setSortField(field);
    setSortDirection(direction);
  };

  // Safe sorting comparisons
  const compare = (a: any, b: any, field: string) => {
    let valA = a[field];
    let valB = b[field];

    if (typeof valA === 'string') {
      return valA.localeCompare(valB);
    }
    if (typeof valA === 'number') {
      return valA - valB;
    }
    return 0;
  };

  // Get active dataset
  const getDataset = () => {
    switch (activeTable) {
      case 'screening': return db.screening;
      case 'enrolment': return db.enrolment;
      case 'delivery': return db.delivery;
      case 'closeout': return db.closeout;
    }
  };

  const filteredAndSortedRecords = () => {
    const dataset = getDataset() as any[];
    
    return dataset
      .filter(record => {
        const sId = record.screeningId || record.deliveryScreeningId || record.sreeningId || '';
        const matchesQuery = sId.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          (record.submittedBy && record.submittedBy.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
          (record.villageOfResidence && record.villageOfResidence.toLowerCase().includes(searchQuery.toLowerCase().trim()));
          
        const facilityField = record.healthFacility || '';
        // Delivery cross-reference facility if needed
        let recordFacility = facilityField;
        if (activeTable === 'delivery' || activeTable === 'closeout') {
          const correspondingScreening = db.screening.find(s => s.screeningId === sId);
          recordFacility = correspondingScreening?.healthFacility || '';
        }

        const matchesFacility = facilityFilter === 'All' || recordFacility === facilityFilter;

        return matchesQuery && matchesFacility;
      })
      .sort((a, b) => {
        const factor = sortDirection === 'asc' ? 1 : -1;
        // Handle nested sort fields if necessary
        return compare(a, b, sortField) * factor;
      });
  };

  const exportToCSV = () => {
    const dataset = filteredAndSortedRecords();
    if (dataset.length === 0) return;

    // For CSV export, we might want to flatten the object
    const flatten = (obj: any, prefix = ''): any => {
      return Object.keys(obj).reduce((acc: any, k) => {
        const pre = prefix.length ? prefix + '_' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
          Object.assign(acc, flatten(obj[k], pre + k));
        } else {
          acc[pre + k] = obj[k];
        }
        return acc;
      }, {});
    };

    const flattenedDataset = dataset.map(d => flatten(d));
    const headers = Object.keys(flattenedDataset[0]);
    
    const csvContent = [
      headers.join(','), // Header row
      ...flattenedDataset.map(row => 
        headers.map(header => {
          const val = row[header];
          return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeTable}_records_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const exportToJSON = () => {
    const dataset = filteredAndSortedRecords();
    if (dataset.length === 0) return;

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataset, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.setAttribute('download', `${activeTable}_records_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Search and Filters Header */}
      <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Audit Log & Tables Browser
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Review persistent registries for clinical trials with initials checking and timestamp stamps
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportToCSV}
              disabled={filteredAndSortedRecords().length === 0}
              className="px-3 py-1.5 bg-slate-105 border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 rounded-lg text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              id="export-csv-btn"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Download CSV
            </button>
            <button
              onClick={exportToJSON}
              disabled={filteredAndSortedRecords().length === 0}
              className="px-3 py-1.5 bg-slate-105 border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 rounded-lg text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              id="export-json-btn"
            >
              <Download className="w-4 h-4 text-indigo-600" />
              Download JSON
            </button>
          </div>
        </div>

        {/* Search Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative rounded-md shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder-slate-400 text-xs transition-all bg-white"
              placeholder="Search Screening ID or Initials..."
              id="records-search-input"
            />
          </div>

          <div>
            <select
              value={facilityFilter}
              onChange={(e) => setFacilityFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              id="records-facility-filter"
            >
              {facilities.map(fac => (
                <option key={fac} value={fac}>
                  Facility: {fac}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 font-mono">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              Logged Role: {
                userRole === 'admin' ? 'Administrator (Full CRUD)' : 
                userRole === 'manager' ? 'Data Manager (View & Enter)' : 
                'Field Tech (Read-Only View)'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Tables Switcher Tabs */}
      <div className="border-b border-slate-150">
        <nav className="flex flex-wrap gap-2 -mb-px" aria-label="Tabs">
          {[
            { id: 'screening', label: '1. Screening Intake', count: db.screening.length, color: 'text-rose-600 bg-rose-50 border-rose-500' },
            { id: 'enrolment', label: '2. Clinical Enrolment', count: db.enrolment.length, color: 'text-violet-600 bg-violet-50 border-violet-500' },
            { id: 'delivery', label: '3. postpartum Delivery', count: db.delivery.length, color: 'text-teal-600 bg-teal-50 border-teal-500' },
            { id: 'closeout', label: '4. Participant Closeout', count: db.closeout.length, color: 'text-amber-600 bg-amber-50 border-amber-500' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTable(tab.id as ActiveTable);
                setSearchQuery('');
                setSortField(tab.id === 'closeout' ? 'dateOfInterview' : 'submittedAt');
              }}
              className={`py-2.5 px-4 font-bold text-xs rounded-t-xl border-b-2 transition-all cursor-pointer flex items-center gap-2 select-none ${
                activeTable === tab.id
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
              id={`tab-btn-${tab.id}`}
            >
              {tab.label}
              <span className="ml-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Records Container Grid */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-xs overflow-hidden">
        {filteredAndSortedRecords().length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <UserRound className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold">No records matches filter values</p>
            <p className="text-xs text-slate-400 mt-1">Change search query or switch tables to see items</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/50">
                {activeTable === 'screening' && (
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('screeningId')}>
                      <div className="flex items-center gap-1">Screening ID <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('facility')}>
                      <div className="flex items-center gap-1">Facility <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('dateOfInterview')}>
                      <div className="flex items-center gap-1">Interview Date <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Age</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">BMI</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Consent</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Eligible</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('submittedBy')}>
                      <div className="flex items-center gap-1">submitted By <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                )}

                {activeTable === 'enrolment' && (
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('screeningId')}>
                      <div className="flex items-center gap-1">Screening ID <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('facility')}>
                      <div className="flex items-center gap-1">Facility <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Village</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Marital</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">BMI</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Education</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('submittedBy')}>
                      <div className="flex items-center gap-1">submitted By <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                )}

                {activeTable === 'delivery' && (
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('screeningId')}>
                      <div className="flex items-center gap-1">Screening ID <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('dateOfDelivery')}>
                      <div className="flex items-center gap-1">Delivery Date <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">BMI</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Assistant</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Mode</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('submittedBy')}>
                      <div className="flex items-center gap-1">submitted By <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                )}

                {activeTable === 'closeout' && (
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('screeningId')}>
                      <div className="flex items-center gap-1">Screening ID <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('dateOfStudyTermination')}>
                      <div className="flex items-center gap-1">Termination Date <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Participant Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Termination Reason</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('submittedBy')}>
                      <div className="flex items-center gap-1">submitted By <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                )}
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredAndSortedRecords().map((record: any) => {
                  const sId = record.screeningId || record.deliveryScreeningId || record.sreeningId || '';
                  return (
                  <tr key={sId} className="hover:bg-slate-50/50 transition-all text-slate-800">
                    {/* Unique Screening ID Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold font-mono text-indigo-900 border-l-4 border-l-indigo-600/30">
                      {sId}
                    </td>

                    {/* Screening Custom Fields Row */}
                    {activeTable === 'screening' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold">{record.healthFacility}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-500">{formatToDdmMmyyyy(record.interviewDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-center font-mono">{record.Age.years}y {record.Age.months}m</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-center font-bold text-slate-600">{record.BMI}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-center font-semibold">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            record.eligibility.consentedToParticipate === 'Yes' ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {record.eligibility.consentedToParticipate}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                            record.eligibility.meetsAllCriteria === 'Yes' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-rose-700'
                          }`}>
                            {record.eligibility.meetsAllCriteria === 'Yes' ? 'Passed' : 'Fail'}
                          </span>
                        </td>
                      </>
                    )}

                    {/* Enrolment Custom Fields Row */}
                    {activeTable === 'enrolment' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold">{record.healthFacility}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-600 truncate max-w-[120px]">{record.villageOfResidence}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">{record.maritalStatus}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-center font-bold text-slate-600">{record.BMI}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 truncate max-w-[120px]">{record.educationLevel}</td>
                      </>
                    )}

                    {/* Delivery Custom Fields Row */}
                    {activeTable === 'delivery' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-500">{formatToDdmMmyyyy(record.deliveryHistory.deliveryDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold">{record.deliveryHistory.deliveryPlace.deliveryChoices}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-center font-bold text-slate-600">
                          {record.bodyMassIndex.unknown ? '?' : record.bodyMassIndex.value || '---'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">{record.deliveryHistory.deliveryPersonnel.deliveryPersValue}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 truncate max-w-[150px]">{record.deliveryHistory.deliveryMode.choices}</td>
                      </>
                    )}

                    {/* Closeout Custom Fields Row */}
                    {activeTable === 'closeout' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-500">{formatToDdmMmyyyy(record.dateOfTermination)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-600 truncate max-w-[180px]">{record.participantStatus.choicesStudy}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-rose-700 font-bold">{record.participantStatus.incompleteReason?.incompletionOptions || 'Graduated (Visits OK)'}</td>
                      </>
                    )}

                    {/* Common submittedBy Column with time string */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-sans">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="w-5 h-5 bg-slate-800 text-slate-300 rounded-full flex items-center justify-center font-bold text-[9px]">
                          {record.submittedBy || 'PA'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {record.submittedAt ? record.submittedAt.substring(0, 10) : 'N/A'}
                        </span>
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-1">
                      <button
                        onClick={() => onViewRecord(activeTable, record)}
                        type="button"
                        className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md transition-all inline-flex items-center gap-1 cursor-pointer"
                        id={`btn-view-${sId}`}
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      
                      {userRole === 'admin' && (
                        <button
                          onClick={() => onEditRecord(activeTable, record)}
                          type="button"
                          className="p-1 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-md transition-all inline-flex items-center gap-1 cursor-pointer"
                          id={`btn-edit-${sId}`}
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                      )}

                      {userRole === 'admin' && onDeleteRecord && (
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete record ${sId}?`)) {
                              onDeleteRecord(activeTable, sId);
                            }
                          }}
                          type="button"
                          className="p-1 hover:bg-red-50 text-red-500 rounded-md transition-all cursor-pointer"
                          id={`btn-delete-${sId}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
                })}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}
