import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface FaqLink {
  text: string;
  url: string;
}

interface FaqAnswer {
  type: 'text' | 'link' | 'code';
  content: string;
  link?: FaqLink;
}

interface FaqDataItem {
  question: string;
  answer: FaqAnswer[];
}

const faqData: FaqDataItem[] = [
  {
    question: 'What is this app and what was it built with?',
    answer: [
      {
        type: 'text',
        content:
          'This is a single-page application built to help players track Pokémon GO events. It was created with ',
      },
      {
        type: 'link',
        content: 'React',
        link: { text: 'React', url: 'https://react.dev/' },
      },
      { type: 'text', content: ', ' },
      {
        type: 'link',
        content: 'TypeScript',
        link: { text: 'TypeScript', url: 'https://www.typescriptlang.org/' },
      },
      { type: 'text', content: ', and ' },
      {
        type: 'link',
        content: 'Material-UI',
        link: { text: 'Material-UI', url: 'https://mui.com/' },
      },
      { type: 'text', content: '. The interactive calendar is powered by ' },
      {
        type: 'link',
        content: 'FullCalendar',
        link: { text: 'FullCalendar', url: 'https://fullcalendar.io/' },
      },
      { type: 'text', content: '.' },
    ],
  },
  {
    question: 'Is this an official Pokémon GO app?',
    answer: [
      {
        type: 'text',
        content:
          'No, this is a free, open-source, fan-made project created to help players track events. It is not affiliated with Niantic, Inc. or The Pokémon Company.',
      },
    ],
  },
  {
    question: 'Where does the event data come from?',
    answer: [
      {
        type: 'text',
        content: 'All event information is gratefully sourced from ',
      },
      {
        type: 'link',
        content: 'LeekDuck.com',
        link: { text: 'LeekDuck.com', url: 'https://leekduck.com/events/' },
      },
      {
        type: 'text',
        content:
          ' using a custom web scraper. The "Last Updated" time in the header shows when the data was last fetched.',
      },
    ],
  },
  {
    question: 'Are my custom events, saved events, and notes private?',
    answer: [
      {
        type: 'text',
        content:
          "Yes, absolutely. All your personal data, including custom events, saved event IDs, notes, filter settings, and preferences, is stored exclusively in your browser's local storage. This data is never sent to any server.",
      },
    ],
  },
  {
    question:
      'What are the Egg Pool, Raid Bosses, Research Tasks, and Rocket Lineup pages?',
    answer: [
      {
        type: 'text',
        content:
          'These pages display current game data sourced from LeekDuck.com. The Egg Pool shows which Pokémon can hatch from different egg types with rarity tiers. Raid Bosses lists current raid encounters with CP ranges for perfect IV catches. Research Tasks shows field research rewards from PokéStops. Rocket Lineup displays Team GO Rocket leader battle lineups with possible encounter Pokémon.',
      },
    ],
  },
  {
    question: 'Can I create my own custom events?',
    answer: [
      {
        type: 'text',
        content:
          "Yes! Click the 'Create Event' button in the header to add your own custom events to the calendar. These could be local community events, raid hours with friends, or personal reminders. Custom events are stored locally in your browser and will appear on the calendar alongside official Pokémon GO events.",
      },
    ],
  },
  {
    question: 'What does the "Save Event" feature do?',
    answer: [
      {
        type: 'text',
        content:
          "You can save (bookmark) events you're interested in by clicking the star icon in the event details. Saved events appear with a filled star and can be filtered using the 'Saved Only' toggle in the filters menu. This makes it easy to track events you plan to attend.",
      },
    ],
  },
  {
    question: 'How do the date and time filters work?',
    answer: [
      {
        type: 'text',
        content:
          "The date pickers allow you to set a start and end date for the events you want to see. The 'Time of Day' slider filters events based on their start time. For example, setting the slider from 6 PM (18:00) to 11 PM (23:00) will only show events that begin within that window.",
      },
    ],
  },
  {
    question: 'How does the "Active Only" filter work?',
    answer: [
      {
        type: 'text',
        content:
          'When you enable the "Active Only" switch, the calendar will only display events that are currently in progress at this very moment (i.e., the current time is between the event\'s start and end times).',
      },
    ],
  },
  {
    question: 'What does the "Add to Calendar" button do?',
    answer: [
      { type: 'text', content: 'This feature downloads an ' },
      { type: 'code', content: '.ics' },
      {
        type: 'text',
        content:
          ' file for the specific event. You can open this file with most standard calendar applications (like Google Calendar, Apple Calendar, or Outlook) to add the event directly to your personal calendar.',
      },
    ],
  },
  {
    question: 'Can I export multiple events at once?',
    answer: [
      {
        type: 'text',
        content:
          'Yes! Use the export button in the header to select and export multiple events to a single ',
      },
      { type: 'code', content: '.ics' },
      {
        type: 'text',
        content:
          ' file. This allows you to add several Pokémon GO events to your personal calendar at once, saving time when planning your gameplay schedule.',
      },
    ],
  },
  {
    question: 'How can I suggest a feature or report a bug?',
    answer: [
      {
        type: 'text',
        content: "Feedback is always welcome! Please visit the project's ",
      },
      {
        type: 'link',
        content: 'GitHub Issues page',
        link: {
          text: 'GitHub Issues page',
          url: 'https://github.com/zhenga8533/pogo-calendar/issues',
        },
      },
      { type: 'text', content: ' to report a bug or suggest a new feature.' },
    ],
  },
];

const FaqItem = React.memo(
  ({ question, answer }: { question: string; answer: FaqAnswer[] }) => {
    return (
      <Accordion
        sx={{
          '&:before': { display: 'none' },
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h3">
            {question}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ borderTop: 1, borderColor: 'divider' }}>
          <Typography>
            {answer.map((part, index) => {
              if (part.type === 'link' && part.link) {
                return (
                  <Typography
                    key={index}
                    component="a"
                    href={part.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {part.link.text}
                  </Typography>
                );
              } else if (part.type === 'code') {
                return (
                  <Typography
                    key={index}
                    component="code"
                    sx={{
                      backgroundColor: 'action.hover',
                      px: 0.5,
                      borderRadius: 0.5,
                    }}
                  >
                    {part.content}
                  </Typography>
                );
              } else {
                return part.content;
              }
            })}
          </Typography>
        </AccordionDetails>
      </Accordion>
    );
  }
);

FaqItem.displayName = 'FaqItem';

function FaqPage() {
  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here are answers to some common questions about the PoGo Event
          Calendar.
        </Typography>
      </Box>
      <Stack spacing={2} sx={{ mb: 4 }}>
        {faqData.map((item) => (
          <FaqItem
            key={item.question}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </Stack>

      <Box sx={{ textAlign: 'center', pt: 2 }}>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          startIcon={<ArrowBackIcon />}
        >
          Back to Calendar
        </Button>
      </Box>
    </Box>
  );
}

export default FaqPage;
