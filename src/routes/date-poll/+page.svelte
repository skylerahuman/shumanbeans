<script lang="ts">
  import { onMount } from 'svelte';
  import { zoom, zoomIdentity } from 'd3-zoom';
  import { select } from 'd3-selection';
  import { io } from 'socket.io-client';

  interface PollData {
    years: { id: number; year: number; vote_count: number }[];
    months: { id: number; year: number; month: number; vote_count: number }[];
    weeks: { id: number; year: number; month: number; week: number; start_date: string; end_date: string; vote_count: number }[];
    days: { id: number; year: number; month: number; week: number; day: number; date: string; vote_count: number }[];
  }

  let pollData: PollData = { years: [], months: [], weeks: [], days: [] };
  let currentView: 'year' | 'month' | 'week' | 'day' = 'year';
  let selectedYear: number | null = null;
  let selectedMonth: number | null = null;
  let selectedWeek: number | null = null;
  let zoomLevel = 1;
  let voterId = '';
  let socket: any;

  // SVG dimensions
  const width = 800;
  const height = 600;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };

  let svgElement: SVGSVGElement;
  let containerElement: HTMLDivElement;

  onMount(async () => {
    // Generate voter ID
    voterId = Math.random().toString(36).substring(2, 15);
    
    // Initialize socket connection
    socket = io();
    socket.on('poll-update', (data: any) => {
      updatePollData(data);
    });

    // Load initial data
    await loadPollData();
    
    // Initialize D3 zoom
    const svg = select(svgElement);
    const zoomBehavior = zoom()
      .scaleExtent([0.5, 4])
      .on('zoom', (event) => {
        const { transform } = event;
        zoomLevel = transform.k;
        
        // Update view based on zoom level
        if (transform.k < 1) {
          setView('year');
        } else if (transform.k < 2) {
          setView('month');
        } else if (transform.k < 3) {
          setView('week');
        } else {
          setView('day');
        }
        
        svg.select('.zoom-container')
          .attr('transform', transform);
      });

    svg.call(zoomBehavior);
  });

  async function loadPollData() {
    try {
      const response = await fetch('/date-poll/api');
      pollData = await response.json();
      await seedInitialData();
    } catch (error) {
      console.error('Failed to load poll data:', error);
    }
  }

  async function seedInitialData() {
    // Seed some initial years if empty
    if (pollData.years.length === 0) {
      const currentYear = new Date().getFullYear();
      for (let year = currentYear; year <= currentYear + 2; year++) {
        await vote('year', year);
      }
    }
  }

  function updatePollData(data: any) {
    pollData = data;
  }

  function setView(view: 'year' | 'month' | 'week' | 'day') {
    currentView = view;
  }

  async function vote(level: string, targetId: number) {
    try {
      const response = await fetch('/date-poll/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voterId, level, targetId })
      });
      
      if (response.ok) {
        // Optimistic update
        const result = await response.json();
        pollData = result.data;
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  }

  function handleYearClick(year: number) {
    selectedYear = year;
    setView('month');
    generateMonthsForYear(year);
  }

  function handleMonthClick(month: number) {
    selectedMonth = month;
    setView('week');
    generateWeeksForMonth(selectedYear!, month);
  }

  function handleWeekClick(week: number) {
    selectedWeek = week;
    setView('day');
    generateDaysForWeek(selectedYear!, selectedMonth!, week);
  }

  async function generateMonthsForYear(year: number) {
    for (let month = 1; month <= 12; month++) {
      await vote('month', parseInt(`${year}${month.toString().padStart(2, '0')}`));
    }
  }

  async function generateWeeksForMonth(year: number, month: number) {
    const date = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0).getDate();
    let week = 1;
    
    for (let day = 1; day <= lastDay; day += 7) {
      const startDate = new Date(year, month - 1, day);
      const endDate = new Date(year, month - 1, Math.min(day + 6, lastDay));
      await vote('week', parseInt(`${year}${month.toString().padStart(2, '0')}${week.toString().padStart(2, '0')}`));
      week++;
    }
  }

  async function generateDaysForWeek(year: number, month: number, week: number) {
    const startDay = (week - 1) * 7 + 1;
    const lastDay = Math.min(startDay + 6, new Date(year, month, 0).getDate());
    
    for (let day = startDay; day <= lastDay; day++) {
      const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      await vote('day', parseInt(`${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`));
    }
  }

  function getColorForVotes(votes: number, maxVotes: number): string {
    const intensity = maxVotes > 0 ? votes / maxVotes : 0;
    const hue = 120 - (intensity * 60); // Green to red
    return `hsl(${hue}, 70%, ${50 + intensity * 30}%)`;
  }

  function goBack() {
    if (currentView === 'month') {
      setView('year');
      selectedYear = null;
    } else if (currentView === 'week') {
      setView('month');
      selectedMonth = null;
    } else if (currentView === 'day') {
      setView('week');
      selectedWeek = null;
    }
  }

  $: maxVotes = Math.max(
    ...(currentView === 'year' ? pollData.years.map(y => y.vote_count) :
        currentView === 'month' ? pollData.months.filter(m => m.year === selectedYear).map(m => m.vote_count) :
        currentView === 'week' ? pollData.weeks.filter(w => w.year === selectedYear && w.month === selectedMonth).map(w => w.vote_count) :
        pollData.days.filter(d => d.year === selectedYear && d.month === selectedMonth && d.week === selectedWeek).map(d => d.vote_count)),
    1
  );
</script>

<div class="container mx-auto p-6">
  <h1 class="text-3xl font-bold text-center mb-6">Community Date Poll</h1>
  
  <div class="mb-4 flex justify-between items-center">
    <div class="text-lg font-semibold">
      Current View: {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
      {#if selectedYear}
        - {selectedYear}
      {/if}
      {#if selectedMonth}
        - {new Date(2024, selectedMonth - 1).toLocaleString('default', { month: 'long' })}
      {/if}
      {#if selectedWeek}
        - Week {selectedWeek}
      {/if}
    </div>
    
    {#if currentView !== 'year'}
      <button 
        on:click={goBack}
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ← Back
      </button>
    {/if}
  </div>

  <div bind:this={containerElement} class="border border-gray-300 rounded-lg overflow-hidden">
    <svg bind:this={svgElement} {width} {height} class="w-full h-auto">
      <g class="zoom-container">
        {#if currentView === 'year'}
          {#each pollData.years as year, i}
            <g transform="translate({(i % 4) * 200 + 50}, {Math.floor(i / 4) * 100 + 50})">
              <rect 
                width="180" 
                height="80" 
                fill={getColorForVotes(year.vote_count, maxVotes)}
                stroke="#333" 
                stroke-width="2"
                rx="5"
                class="cursor-pointer hover:opacity-80"
                on:click={() => handleYearClick(year.year)}
              />
              <text x="90" y="45" text-anchor="middle" class="fill-white font-bold text-lg pointer-events-none">
                {year.year}
              </text>
              <text x="90" y="65" text-anchor="middle" class="fill-white text-sm pointer-events-none">
                {year.vote_count} votes
              </text>
            </g>
          {/each}
        {:else if currentView === 'month'}
          {#each pollData.months.filter(m => m.year === selectedYear) as month, i}
            <g transform="translate({(i % 4) * 200 + 50}, {Math.floor(i / 4) * 100 + 50})">
              <rect 
                width="180" 
                height="80" 
                fill={getColorForVotes(month.vote_count, maxVotes)}
                stroke="#333" 
                stroke-width="2"
                rx="5"
                class="cursor-pointer hover:opacity-80"
                on:click={() => handleMonthClick(month.month)}
              />
              <text x="90" y="40" text-anchor="middle" class="fill-white font-bold text-lg pointer-events-none">
                {new Date(2024, month.month - 1).toLocaleString('default', { month: 'long' })}
              </text>
              <text x="90" y="60" text-anchor="middle" class="fill-white text-sm pointer-events-none">
                {month.vote_count} votes
              </text>
            </g>
          {/each}
        {:else if currentView === 'week'}
          {#each pollData.weeks.filter(w => w.year === selectedYear && w.month === selectedMonth) as week, i}
            <g transform="translate({(i % 4) * 200 + 50}, {Math.floor(i / 4) * 100 + 50})">
              <rect 
                width="180" 
                height="80" 
                fill={getColorForVotes(week.vote_count, maxVotes)}
                stroke="#333" 
                stroke-width="2"
                rx="5"
                class="cursor-pointer hover:opacity-80"
                on:click={() => handleWeekClick(week.week)}
              />
              <text x="90" y="35" text-anchor="middle" class="fill-white font-bold text-lg pointer-events-none">
                Week {week.week}
              </text>
              <text x="90" y="55" text-anchor="middle" class="fill-white text-xs pointer-events-none">
                {week.start_date} - {week.end_date}
              </text>
              <text x="90" y="70" text-anchor="middle" class="fill-white text-sm pointer-events-none">
                {week.vote_count} votes
              </text>
            </g>
          {/each}
        {:else if currentView === 'day'}
          {#each pollData.days.filter(d => d.year === selectedYear && d.month === selectedMonth && d.week === selectedWeek) as day, i}
            <g transform="translate({(i % 7) * 110 + 50}, {Math.floor(i / 7) * 100 + 50})">
              <rect 
                width="100" 
                height="80" 
                fill={getColorForVotes(day.vote_count, maxVotes)}
                stroke="#333" 
                stroke-width="2"
                rx="5"
                class="cursor-pointer hover:opacity-80"
                on:click={() => vote('day', day.id)}
              />
              <text x="50" y="40" text-anchor="middle" class="fill-white font-bold text-lg pointer-events-none">
                {day.day}
              </text>
              <text x="50" y="60" text-anchor="middle" class="fill-white text-sm pointer-events-none">
                {day.vote_count} votes
              </text>
            </g>
          {/each}
        {/if}
      </g>
    </svg>
  </div>

  <div class="mt-4 text-center text-sm text-gray-600">
    Use mouse wheel to zoom in/out between different time periods
  </div>
</div>

<style>
  .container {
    max-width: 900px;
  }
</style>
