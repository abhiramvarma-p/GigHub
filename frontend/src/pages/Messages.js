import React, { useState } from 'react';
import { Container, Grid, Box, Typography } from '@mui/material';
import Conversations from '../components/Conversations';
import Chat from '../components/Chat';

const Messages = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <Container maxWidth="lg" sx={{ py: 4, height: 'calc(100vh - 64px)' }}>
      <Grid container spacing={3} sx={{ height: '100%' }}>
        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <Conversations onSelectConversation={setSelectedUser} />
        </Grid>
        <Grid item xs={12} md={8} sx={{ height: '100%' }}>
          {selectedUser ? (
            <Chat
              recipientId={selectedUser._id}
              recipientName={selectedUser.name}
              recipientPicture={selectedUser.profilePicture}
            />
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.paper',
                borderRadius: 1,
                p: 3,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Select a conversation to start chatting
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Messages; 