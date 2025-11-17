import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Divider,
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

function FaqPage() {
  return (
    <Container maxWidth="md">
      <Stack spacing={4}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Here are answers to some common questions about the PoGo Event
            Calendar.
          </Typography>
        </Box>
        <Divider />
        <Stack spacing={2}>
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
      </Stack>
    </Container>
  );
}

export default FaqPage;
