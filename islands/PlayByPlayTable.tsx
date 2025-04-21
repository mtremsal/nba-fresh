import { useMemo, useState } from "preact/hooks";
import { PlayByPlay } from "../models/Game.ts";

// Define a type for our segments that includes the period
interface Segment {
  plays: PlayByPlay[];
  period: number;
  // Store the original index in the calculatedSegments array for easy lookup
  originalIndex: number;
}

interface PlayByPlayTableProps {
  playByPlay: PlayByPlay[];
}

export default function PlayByPlayTable({ playByPlay }: PlayByPlayTableProps) {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);

  // segments will now be of type Segment[]
  const segments: Segment[] = useMemo(() => {
    if (!playByPlay || playByPlay.length === 0) {
      return [];
    }

    const calculatedSegments: Segment[] = [];
    let currentSegmentPlays: PlayByPlay[] = [];
    let currentPeriod = playByPlay[0]?.period ?? 1; // Start with the period of the first play

    for (const play of playByPlay) {
      // Add the current play to the segment being built
      currentSegmentPlays.push(play);
      currentPeriod = play.period; // Keep track of the period of the last play added

      // If this play has a score, it finalizes the current segment
      if (play.score) {
        calculatedSegments.push({
          plays: currentSegmentPlays,
          period: currentPeriod, // Assign the period of the last play in the segment
          originalIndex: calculatedSegments.length, // Store its index
        });
        currentSegmentPlays = []; // Start a new segment for subsequent plays
      }
    }

    // Add the last segment if it has plays (non-scoring at the end)
    if (currentSegmentPlays.length > 0) {
      calculatedSegments.push({
        plays: currentSegmentPlays,
        period: currentPeriod,
        originalIndex: calculatedSegments.length,
      });
    }

    // Handle edge case: if the input had plays but no scoring plays at all
    if (calculatedSegments.length === 0 && playByPlay.length > 0) {
      calculatedSegments.push({
        plays: playByPlay,
        period: playByPlay[0]?.period ?? 1,
        originalIndex: 0,
      });
    }

    return calculatedSegments;
  }, [playByPlay]);

  if (!playByPlay || playByPlay.length === 0) {
    return <p>Play-by-play data not available for this game.</p>;
  }

  // Get the current segment based on the index
  const currentSegment = segments[currentSegmentIndex];
  const currentPlays = currentSegment?.plays || [];
  const currentPeriod = currentSegment?.period ?? 1;

  // --- Navigation Functions ---
  const goToNext = () => {
    setCurrentSegmentIndex((prev) => Math.min(prev + 1, segments.length - 1));
  };

  const goToPrevious = () => {
    setCurrentSegmentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToNextQuarter = () => {
    const nextQuarter = currentPeriod + 1;
    // Find the first segment that belongs to the next quarter or any subsequent quarter
    const nextQuarterSegmentIndex = segments.findIndex(
      (segment, index) =>
        index > currentSegmentIndex && segment.period >= nextQuarter,
    );

    if (nextQuarterSegmentIndex !== -1) {
      setCurrentSegmentIndex(nextQuarterSegmentIndex);
    } else {
      // If no segment found for next quarter, go to the last segment
      setCurrentSegmentIndex(segments.length - 1);
    }
  };

  const goToPreviousQuarter = () => {
    const targetPeriod = currentPeriod - 1;
    if (targetPeriod < 1) return; // Cannot go before Q1

    // Find the *last* segment index of the period *before* the target period
    let lastIndexOfPeriodBeforeTarget = -1;
    for (let i = 0; i < segments.length; i++) {
      if (segments[i].period < targetPeriod) {
        lastIndexOfPeriodBeforeTarget = i;
      } else {
        break; // Stop searching once we reach or exceed the target period
      }
    }

    // The first segment of the target period is the one *after* this index
    const firstIndexOfTargetPeriod = lastIndexOfPeriodBeforeTarget + 1;

    // Ensure the found index is valid and actually belongs to the target period
    if (
      firstIndexOfTargetPeriod < segments.length &&
      segments[firstIndexOfTargetPeriod].period === targetPeriod
    ) {
      setCurrentSegmentIndex(firstIndexOfTargetPeriod);
    } else if (targetPeriod > 0) {
      // Fallback: If exact period not found, try finding the last segment of the period before it.
      // This handles cases where a quarter might have no scoring plays.
      // Find the first segment of the *current* period if we are trying to go back.
      const firstCurrentPeriodIndex = segments.findIndex((s) =>
        s.period === currentPeriod
      );
      if (firstCurrentPeriodIndex > 0) {
        // Go to the segment just before the current period started
        setCurrentSegmentIndex(firstCurrentPeriodIndex - 1);
      }
    } // If still no suitable index found (e.g., already in Q1), do nothing or go to index 0
    else {
      setCurrentSegmentIndex(0);
    }
  };

  // Determine if quarter navigation is possible
  const canGoToNextQuarter = segments.some((s) => s.period > currentPeriod);
  const canGoToPrevQuarter = segments.some((s) => s.period < currentPeriod);

  // Define common button classes for consistency
  // Added w-10 for fixed width and text-center
  const buttonBaseClasses =
    "w-10 px-2 py-1 text-base font-bold text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-center";

  return (
    <div class="mt-8">
      {/* Header and Pagination Container */}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Play-by-Play</h2>

        {/* Pagination Controls */}
        {segments.length > 1 && (
          <div class="flex items-center space-x-2">
            {/* Previous Quarter Button - Updated Icon */}
            <button
              onClick={goToPreviousQuarter}
              disabled={!canGoToPrevQuarter}
              class={buttonBaseClasses} // Apply base classes
              aria-label="Previous Quarter"
            >
              ⇤
            </button>
            {/* Previous Scoring Play Button */}
            <button
              onClick={goToPrevious}
              disabled={currentSegmentIndex === 0}
              class={buttonBaseClasses} // Apply base classes
              aria-label="Previous Scoring Play"
            >
              ←
            </button>
            {/* Status Text - Added fixed width and text-center */}
            <span class="w-46 text-sm text-gray-700 whitespace-nowrap text-center">
              {/* Prevent wrapping and center text */}
              Q{currentPeriod} | Scoring Play {currentSegmentIndex + 1} of{" "}
              {segments.length}
            </span>
            {/* Next Scoring Play Button */}
            <button
              onClick={goToNext}
              disabled={currentSegmentIndex === segments.length - 1}
              class={buttonBaseClasses} // Apply base classes
              aria-label="Next Scoring Play"
            >
              →
            </button>
            {/* Next Quarter Button - Updated Icon */}
            <button
              onClick={goToNextQuarter}
              disabled={!canGoToNextQuarter}
              class={buttonBaseClasses} // Apply base classes
              aria-label="Next Quarter"
            >
              ⇥
            </button>
          </div>
        )}
      </div>

      {/* Play-by-Play Table */}
      <div class="overflow-x-auto">
        {/* Add table-fixed for consistent column widths */}
        <table class="min-w-full bg-white shadow rounded-lg table-fixed">
          <thead>
            <tr class="bg-gray-100">
              {/* Apply fixed widths to header columns */}
              <th class="w-16 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period
              </th>
              <th class="w-20 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th class="w-24 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              {/* Description column takes remaining width */}
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {currentPlays.map((play) => {
              // Swap score order assuming input is "Away - Home"
              let displayScore = "-";
              if (play.score) {
                const parts = play.score.split(" - ");
                if (parts.length === 2) {
                  displayScore = `${parts[1]} - ${parts[0]}`; // Swap: Home - Away
                } else {
                  displayScore = play.score; // Fallback if format is unexpected
                }
              }

              return (
                <tr key={play.eventNum}>
                  <td class="px-4 py-2 whitespace-nowrap">{play.period}</td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    {play.pcTimeString}
                  </td>
                  {/* Display the potentially swapped score */}
                  <td class="px-4 py-2 whitespace-nowrap">{displayScore}</td>
                  {/* Simplified description display */}
                  <td class="px-4 py-2">
                    {play.homeDescription || play.visitorDescription ||
                      play.neutralDescription || "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
