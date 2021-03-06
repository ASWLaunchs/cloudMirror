import QUnit from 'qunit';
import {default as SyncController,
  syncPointStrategies as strategies } from '../src/sync-controller.js';
import { playlistWithDuration } from './test-helpers.js';

function getStrategy(name) {
  for (let i = 0; i < strategies.length; i++) {
    if (strategies[i].name === name) {
      return strategies[i];
    }
  }
  throw new Error('No sync-strategy named "${name}" was found!');
}

QUnit.module('SyncController', {
  beforeEach() {
    this.syncController = new SyncController();
  }
});

QUnit.test('returns correct sync point for VOD strategy', function(assert) {
  const playlist = playlistWithDuration(40);
  let duration = 40;
  const timeline = 0;
  const vodStrategy = getStrategy('VOD');
  let syncPoint = vodStrategy.run(this.syncController, playlist, duration, timeline);

  assert.deepEqual(syncPoint, { time: 0, segmentIndex: 0, partIndex: null }, 'sync point found for vod');

  duration = Infinity;
  syncPoint = vodStrategy.run(this.syncController, playlist, duration, timeline);

  assert.equal(syncPoint, null, 'no syncpoint found for non vod ');
});

QUnit.test('returns correct sync point for ProgramDateTime strategy', function(assert) {
  const strategy = getStrategy('ProgramDateTime');
  const datetime = new Date(2012, 11, 12, 12, 12, 12);
  const playlist = playlistWithDuration(40);
  const timeline = 0;
  const duration = Infinity;
  let syncPoint;

  syncPoint = strategy.run(this.syncController, playlist, duration, timeline);

  assert.equal(syncPoint, null, 'no syncpoint when no date time to display time mapping');

  playlist.segments[0].dateTimeObject = datetime;

  this.syncController.setDateTimeMappingForStart(playlist);

  const newPlaylist = playlistWithDuration(40);

  syncPoint = strategy.run(this.syncController, newPlaylist, duration, timeline);

  assert.equal(syncPoint, null, 'no syncpoint when datetimeObject not set on playlist');

  newPlaylist.segments[0].dateTimeObject = new Date(2012, 11, 12, 12, 12, 22);

  syncPoint = strategy.run(this.syncController, newPlaylist, duration, timeline);

  assert.deepEqual(syncPoint, {
    time: 10,
    segmentIndex: 0,
    partIndex: null
  }, 'syncpoint found for ProgramDateTime set');
});

QUnit.test('ProgramDateTime strategy finds nearest segment for sync', function(assert) {
  const strategy = getStrategy('ProgramDateTime');
  const playlist = playlistWithDuration(200);
  const timeline = 0;
  const duration = Infinity;
  let syncPoint;

  syncPoint = strategy.run(this.syncController, playlist, duration, timeline, 170);

  assert.equal(syncPoint, null, 'no syncpoint when no date time to display time mapping');

  playlist.segments.forEach((segment, index) => {
    segment.dateTimeObject = new Date(2012, 11, 12, 12, 12, 12 + (index * 10));
  });

  this.syncController.setDateTimeMappingForStart(playlist);

  const newPlaylist = playlistWithDuration(200);

  syncPoint = strategy.run(this.syncController, newPlaylist, duration, timeline);

  assert.equal(syncPoint, null, 'no syncpoint when datetimeObject not set on playlist');

  newPlaylist.segments.forEach((segment, index) => {
    segment.dateTimeObject = new Date(2012, 11, 12, 12, 12, 22 + (index * 10));
  });

  syncPoint = strategy.run(this.syncController, newPlaylist, duration, timeline, 170);

  assert.deepEqual(syncPoint, {
    time: 160,
    segmentIndex: 15,
    partIndex: null
  }, 'syncpoint found for ProgramDateTime set');

  syncPoint = strategy.run(this.syncController, newPlaylist, duration, timeline, 0);

  assert.deepEqual(syncPoint, {
    time: 10,
    segmentIndex: 0,
    partIndex: null
  }, 'syncpoint found for ProgramDateTime set at 0');
});

QUnit.test(
  'Does not set date time mapping if date time info not on first segment',
  function(assert) {
    const playlist = playlistWithDuration(40);

    playlist.segments[1].dateTimeObject = new Date(2012, 11, 12, 12, 12, 12);

    this.syncController.setDateTimeMappingForStart(playlist);

    assert.equal(
      Object.keys(this.syncController.timelineToDatetimeMappings).length,
      0,
      'did not set datetime mapping'
    );

    playlist.segments[0].dateTimeObject = new Date(2012, 11, 12, 12, 12, 2);

    this.syncController.setDateTimeMappingForStart(playlist);

    assert.equal(
      Object.keys(this.syncController.timelineToDatetimeMappings).length,
      1,
      'did set datetime mapping'
    );
  }
);

QUnit.test('uses separate date time to display time mapping for each timeline', function(assert) {
  const playlist = playlistWithDuration(40, { discontinuityStarts: [1, 3] });

  playlist.segments[0].dateTimeObject = new Date(2020, 1, 1, 1, 1, 1);
  // 20 seconds later (10 more than default)
  playlist.segments[1].dateTimeObject = new Date(2020, 1, 1, 1, 1, 21);
  playlist.segments[2].dateTimeObject = new Date(2020, 1, 1, 1, 1, 31);
  // 30 seconds later (20 more than default)
  playlist.segments[3].dateTimeObject = new Date(2020, 1, 1, 1, 2, 1);

  // after this call, the initial playlist mapping will be provided
  this.syncController.setDateTimeMappingForStart(playlist);

  // since this segment does not have a discontinuity, there should be no additional or
  // changed mappings from the initial
  this.syncController.saveSegmentTimingInfo({
    segmentInfo: {
      playlist,
      segment: playlist.segments[0],
      timeline: 0,
      mediaIndex: 0
    },
    shouldSaveTimelineMapping: true
  });

  assert.deepEqual(
    this.syncController.timelineToDatetimeMappings,
    {
      0: -(playlist.segments[0].dateTimeObject.getTime() / 1000)
    },
    'has correct mapping for timeline 0'
  );

  this.syncController.saveSegmentTimingInfo({
    segmentInfo: {
      playlist,
      segment: playlist.segments[1],
      timeline: 1,
      mediaIndex: 1
    },
    shouldSaveTimelineMapping: true
  });

  assert.deepEqual(
    this.syncController.timelineToDatetimeMappings,
    {
      0: -(playlist.segments[0].dateTimeObject.getTime() / 1000),
      1: -(playlist.segments[1].dateTimeObject.getTime() / 1000)
    },
    'has correct mapping for timelines 0 and 1'
  );

  this.syncController.saveSegmentTimingInfo({
    segmentInfo: {
      playlist,
      segment: playlist.segments[2],
      timeline: 1,
      mediaIndex: 2
    },
    shouldSaveTimelineMapping: true
  });

  assert.deepEqual(
    this.syncController.timelineToDatetimeMappings,
    {
      0: -(playlist.segments[0].dateTimeObject.getTime() / 1000),
      1: -(playlist.segments[1].dateTimeObject.getTime() / 1000)
    },
    'does not add a new timeline mapping when no disco'
  );

  this.syncController.saveSegmentTimingInfo({
    segmentInfo: {
      playlist,
      segment: playlist.segments[3],
      timeline: 2,
      mediaIndex: 3
    },
    shouldSaveTimelineMapping: true
  });

  assert.deepEqual(
    this.syncController.timelineToDatetimeMappings,
    {
      0: -(playlist.segments[0].dateTimeObject.getTime() / 1000),
      1: -(playlist.segments[1].dateTimeObject.getTime() / 1000),
      2: -(playlist.segments[3].dateTimeObject.getTime() / 1000)
    },
    'has correct mappings for timelines 0, 1, and 2'
  );
});

QUnit.test('ProgramDateTime strategy finds nearest llhls sync point', function(assert) {
  const strategy = getStrategy('ProgramDateTime');
  const playlist = playlistWithDuration(200, {llhls: true});
  const timeline = 0;
  const duration = Infinity;
  let syncPoint;

  syncPoint = strategy.run(this.syncController, playlist, duration, timeline, 170);

  assert.equal(syncPoint, null, 'no syncpoint when no date time to display time mapping');

  playlist.segments.forEach((segment, index) => {
    segment.dateTimeObject = new Date(2012, 11, 12, 12, 12, 12 + (index * 10));
  });

  this.syncController.setDateTimeMappingForStart(playlist);

  syncPoint = strategy.run(this.syncController, playlist, duration, timeline, 194);

  assert.deepEqual(syncPoint, {
    time: 192,
    segmentIndex: 19,
    partIndex: 1
  }, 'syncpoint found for ProgramDateTime');

  syncPoint = strategy.run(this.syncController, playlist, duration, timeline, 204);

  assert.deepEqual(syncPoint, {
    time: 198,
    segmentIndex: 19,
    partIndex: 4
  }, 'syncpoint found for ProgramDateTime');
});

QUnit.test('returns correct sync point for Segment strategy', function(assert) {
  const strategy = getStrategy('Segment');
  const playlist = {
    segments: [
      { timeline: 0 },
      { timeline: 0 },
      { timeline: 1, start: 10 },
      { timeline: 1, start: 20 },
      { timeline: 1 },
      { timeline: 1 },
      { timeline: 1, start: 50 },
      { timeline: 1, start: 60 }
    ]
  };
  let currentTimeline;
  let syncPoint;

  currentTimeline = 0;
  syncPoint = strategy.run(this.syncController, playlist, 80, currentTimeline, 0);
  assert.equal(syncPoint, null, 'no syncpoint for timeline 0');

  currentTimeline = 1;
  syncPoint = strategy.run(this.syncController, playlist, 80, currentTimeline, 30);
  assert.deepEqual(
    syncPoint, { time: 20, segmentIndex: 3, partIndex: null },
    'closest sync point found'
  );

  syncPoint = strategy.run(this.syncController, playlist, 80, currentTimeline, 40);
  assert.deepEqual(
    syncPoint, { time: 50, segmentIndex: 6, partIndex: null },
    'closest sync point found'
  );

  syncPoint = strategy.run(this.syncController, playlist, 80, currentTimeline, 50);
  assert.deepEqual(
    syncPoint, { time: 50, segmentIndex: 6, partIndex: null },
    'exact sync point found'
  );
});

QUnit.test('returns correct sync point for llhls Segment strategy', function(assert) {
  const strategy = getStrategy('Segment');
  const playlist = {
    segments: [
      { timeline: 0 },
      { timeline: 0 },
      { timeline: 1, start: 10 },
      { timeline: 1, start: 20 },
      { timeline: 1 },
      { timeline: 1 },
      { timeline: 1, start: 50, parts: [
        {start: 50, duration: 1},
        {start: 51, duration: 1},
        {start: 52, duration: 1},
        {start: 53, duration: 1},
        {start: 54, duration: 1},
        {start: 55, duration: 1},
        {start: 56, duration: 1},
        {start: 57, duration: 1},
        {start: 58, duration: 1},
        {start: 59, duration: 1}
      ]},
      { timeline: 1, start: 60, parts: [
        {start: 60, duration: 1},
        {start: 61, duration: 1},
        {start: 62, duration: 1},
        {start: 63, duration: 1},
        {start: 64, duration: 1},
        {start: 65, duration: 1},
        {start: 66, duration: 1},
        {start: 67, duration: 1},
        {start: 68, duration: 1},
        {start: 69, duration: 1}
      ] }
    ]
  };
  const currentTimeline = 1;

  assert.deepEqual(
    strategy.run(this.syncController, playlist, 80, currentTimeline, 55),
    { time: 55, segmentIndex: 6, partIndex: 5 },
    'exact sync point found'
  );

  assert.deepEqual(
    strategy.run(this.syncController, playlist, 80, currentTimeline, 70),
    { time: 69, segmentIndex: 7, partIndex: 9 },
    'closest sync point found'
  );

});

QUnit.test('returns correct sync point for Discontinuity strategy', function(assert) {
  const strategy = getStrategy('Discontinuity');
  const playlist = {
    targetDuration: 10,
    discontinuitySequence: 2,
    discontinuityStarts: [2, 5],
    segments: [
      { timeline: 2, start: 20, end: 30, duration: 10 },
      { timeline: 2, start: 30, end: 40, duration: 10 },
      { timeline: 3, start: 40, end: 50, duration: 10, discontinuity: true },
      { timeline: 3, start: 50, end: 60, duration: 10 },
      { timeline: 3, start: 60, end: 70, duration: 10 },
      { timeline: 4, start: 70, end: 80, duration: 10, discontinuity: true },
      { timeline: 4, start: 80, end: 90, duration: 10 },
      { timeline: 4, start: 90, end: 100, duration: 10 }
    ]
  };
  const segmentInfo = {
    playlist,
    segment: playlist.segments[2],
    mediaIndex: 2
  };
  let currentTimeline = 3;
  let syncPoint;

  syncPoint = strategy.run(this.syncController, playlist, 100, currentTimeline, 0);
  assert.equal(syncPoint, null, 'no sync point when no discontinuities saved');

  this.syncController.saveDiscontinuitySyncInfo_(segmentInfo);

  syncPoint = strategy.run(this.syncController, playlist, 100, currentTimeline, 55);
  assert.deepEqual(
    syncPoint, { time: 40, segmentIndex: 2, partIndex: null },
    'found sync point for timeline 3'
  );

  segmentInfo.mediaIndex = 6;
  segmentInfo.segment = playlist.segments[6];
  currentTimeline = 4;

  this.syncController.saveDiscontinuitySyncInfo_(segmentInfo);

  syncPoint = strategy.run(this.syncController, playlist, 100, currentTimeline, 90);
  assert.deepEqual(
    syncPoint, { time: 70, segmentIndex: 5, partIndex: null },
    'found sync point for timeline 4'
  );
});

QUnit.test('returns correct sync point for Playlist strategy', function(assert) {
  const strategy = getStrategy('Playlist');
  const playlist = { mediaSequence: 100 };
  let syncPoint;

  syncPoint = strategy.run(this.syncController, playlist, 40, 0);
  assert.equal(syncPoint, null, 'no sync point if no sync info');

  playlist.mediaSequence = 102;
  playlist.syncInfo = { time: 10, mediaSequence: 100};

  syncPoint = strategy.run(this.syncController, playlist, 40, 0);
  assert.deepEqual(
    syncPoint, { time: 10, segmentIndex: -2, partIndex: null },
    'found sync point in playlist'
  );
});

QUnit.test('saves expired info onto new playlist for sync point', function(assert) {
  const oldPlaylist = playlistWithDuration(50);
  const newPlaylist = playlistWithDuration(50);

  oldPlaylist.mediaSequence = 100;
  newPlaylist.mediaSequence = 103;

  oldPlaylist.segments[0].start = 390;
  oldPlaylist.segments[1].start = 400;

  this.syncController.saveExpiredSegmentInfo(oldPlaylist, newPlaylist);

  assert.deepEqual(
    newPlaylist.syncInfo, { mediaSequence: 101, time: 400 },
    'saved correct info for expired segment onto new playlist'
  );
});

QUnit.test('skips save of expired segment info if media sequence gap too large', function(assert) {
  const oldPlaylist = playlistWithDuration(50);
  const newPlaylist = playlistWithDuration(50);

  oldPlaylist.mediaSequence = 100;
  newPlaylist.mediaSequence = 86501;

  oldPlaylist.segments[0].start = 390;
  oldPlaylist.segments[1].start = 400;

  this.syncController.saveExpiredSegmentInfo(oldPlaylist, newPlaylist);

  assert.strictEqual(
    typeof newPlaylist.syncInfo, 'undefined',
    'skipped saving sync info onto new playlist'
  );
});

QUnit.test('saves segment timing info', function(assert) {
  const syncCon = this.syncController;
  const playlist = playlistWithDuration(60);

  playlist.discontinuityStarts = [3];
  playlist.discontinuitySequence = 0;
  playlist.segments[3].discontinuity = true;
  playlist.segments.forEach((segment, i) => {
    if (i >= playlist.discontinuityStarts[0]) {
      segment.timeline = 1;
    } else {
      segment.timeline = 0;
    }
  });

  const updateTimingInfo = (segmentInfo) => {
    segmentInfo.timingInfo = {
      // offset segment timing to make things interesting
      start: segmentInfo.mediaIndex * 10 + 5 + (6 * segmentInfo.timeline),
      end: segmentInfo.mediaIndex * 10 + 10 + 5 + (6 * segmentInfo.timeline)
    };
  };

  let segment = playlist.segments[0];
  const segmentInfo = {
    mediaIndex: 0,
    playlist,
    timeline: 0,
    timestampOffset: 0,
    startOfSegment: 0,
    segment
  };

  updateTimingInfo(segmentInfo);
  syncCon.saveSegmentTimingInfo({ segmentInfo, shouldSaveTimelineMapping: true });
  assert.ok(syncCon.timelines[0], 'created mapping object for timeline 0');
  assert.deepEqual(
    syncCon.timelines[0], { time: 0, mapping: -5 },
    'mapping object correct'
  );
  assert.equal(segment.start, 0, 'correctly calculated segment start');
  assert.equal(segment.end, 10, 'correctly calculated segment end');
  assert.ok(syncCon.discontinuities[1], 'created discontinuity info for timeline 1');
  assert.deepEqual(
    syncCon.discontinuities[1], { time: 30, accuracy: 3 },
    'discontinuity sync info correct'
  );

  segmentInfo.timestampOffset = null;
  segmentInfo.startOfSegment = 10;
  segmentInfo.mediaIndex = 1;
  segment = playlist.segments[1];
  segmentInfo.segment = segment;

  updateTimingInfo(segmentInfo);
  syncCon.saveSegmentTimingInfo({ segmentInfo, shouldSaveTimelineMapping: true });
  assert.equal(segment.start, 10, 'correctly calculated segment start');
  assert.equal(segment.end, 20, 'correctly calculated segment end');
  assert.deepEqual(
    syncCon.discontinuities[1], { time: 30, accuracy: 2 },
    'discontinuity sync info correctly updated with new accuracy'
  );

  segmentInfo.timestampOffset = 30;
  segmentInfo.startOfSegment = 30;
  segmentInfo.mediaIndex = 3;
  segmentInfo.timeline = 1;
  segment = playlist.segments[3];
  segmentInfo.segment = segment;

  updateTimingInfo(segmentInfo);
  syncCon.saveSegmentTimingInfo({ segmentInfo, shouldSaveTimelineMapping: true });
  assert.ok(syncCon.timelines[1], 'created mapping object for timeline 1');
  assert.deepEqual(
    syncCon.timelines[1], { time: 30, mapping: -11 },
    'mapping object correct'
  );
  assert.equal(segment.start, 30, 'correctly calculated segment start');
  assert.equal(segment.end, 40, 'correctly calculated segment end');
  assert.deepEqual(
    syncCon.discontinuities[1], { time: 30, accuracy: 0 },
    'discontinuity sync info correctly updated with new accuracy'
  );
});

QUnit.test('Correctly calculates expired time', function(assert) {
  let playlist = {
    targetDuration: 10,
    mediaSequence: 100,
    discontinuityStarts: [],
    syncInfo: {
      time: 50,
      mediaSequence: 95
    },
    segments: [
      {
        duration: 10,
        uri: '0.ts'
      },
      {
        duration: 10,
        uri: '1.ts'
      },
      {
        duration: 10,
        uri: '2.ts'
      },
      {
        duration: 10,
        uri: '3.ts'
      },
      {
        duration: 10,
        uri: '4.ts'
      }
    ]
  };

  let expired = this.syncController.getExpiredTime(playlist, Infinity);

  assert.equal(expired, 100, 'estimated expired time using segmentSync');

  playlist = {
    targetDuration: 10,
    discontinuityStarts: [],
    mediaSequence: 100,
    segments: [
      {
        duration: 10,
        uri: '0.ts'
      },
      {
        duration: 10,
        uri: '1.ts',
        start: 108.5,
        end: 118.4
      },
      {
        duration: 10,
        uri: '2.ts'
      },
      {
        duration: 10,
        uri: '3.ts'
      },
      {
        duration: 10,
        uri: '4.ts'
      }
    ]
  };

  expired = this.syncController.getExpiredTime(playlist, Infinity);

  assert.equal(expired, 98.5, 'estimated expired time using segmentSync');

  playlist = {
    discontinuityStarts: [],
    targetDuration: 10,
    mediaSequence: 100,
    syncInfo: {
      time: 50,
      mediaSequence: 95
    },
    segments: [
      {
        duration: 10,
        uri: '0.ts'
      },
      {
        duration: 10,
        uri: '1.ts',
        start: 108.5,
        end: 118.5
      },
      {
        duration: 10,
        uri: '2.ts'
      },
      {
        duration: 10,
        uri: '3.ts'
      },
      {
        duration: 10,
        uri: '4.ts'
      }
    ]
  };

  expired = this.syncController.getExpiredTime(playlist, Infinity);

  assert.equal(expired, 98.5, 'estimated expired time using segmentSync');

  playlist = {
    targetDuration: 10,
    discontinuityStarts: [],
    mediaSequence: 100,
    syncInfo: {
      time: 90.8,
      mediaSequence: 99
    },
    segments: [
      {
        duration: 10,
        uri: '0.ts'
      },
      {
        duration: 10,
        uri: '1.ts'
      },
      {
        duration: 10,
        uri: '2.ts',
        start: 118.5,
        end: 128.5
      },
      {
        duration: 10,
        uri: '3.ts'
      },
      {
        duration: 10,
        uri: '4.ts'
      }
    ]
  };

  expired = this.syncController.getExpiredTime(playlist, Infinity);

  assert.equal(expired, 100.8, 'estimated expired time using segmentSync');

  playlist = {
    targetDuration: 10,
    discontinuityStarts: [],
    mediaSequence: 100,
    endList: true,
    segments: [
      {
        duration: 10,
        uri: '0.ts'
      },
      {
        duration: 10,
        uri: '1.ts'
      },
      {
        duration: 10,
        uri: '2.ts'
      },
      {
        duration: 10,
        uri: '3.ts'
      },
      {
        duration: 10,
        uri: '4.ts'
      }
    ]
  };

  expired = this.syncController.getExpiredTime(playlist, 50);

  assert.equal(expired, 0, 'estimated expired time using segmentSync');

  playlist = {
    targetDuration: 10,
    discontinuityStarts: [],
    mediaSequence: 100,
    endList: true,
    segments: [
      {
        start: 0.006,
        duration: 10,
        uri: '0.ts',
        end: 9.982
      },
      {
        duration: 10,
        uri: '1.ts'
      },
      {
        duration: 10,
        uri: '2.ts'
      },
      {
        duration: 10,
        uri: '3.ts'
      },
      {
        duration: 10,
        uri: '4.ts'
      }
    ]
  };

  expired = this.syncController.getExpiredTime(playlist, 50);

  assert.equal(expired, 0, 'estimated expired time using segmentSync');
});
