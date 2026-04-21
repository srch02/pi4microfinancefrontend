import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Send, Lock, Search, MoreVertical, User } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  encrypted: boolean;
}

interface ChatMember {
  id: string;
  name: string;
  online: boolean;
  lastSeen?: string;
}

export function GroupChat() {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<ChatMember | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const currentUserId = 'M-12847';

  const groupMembers: ChatMember[] = [
    { id: 'M-10234', name: 'Marie Dupont', online: true },
    { id: 'M-10567', name: 'Amadou Diallo', online: false, lastSeen: '2 hours ago' },
    { id: 'M-11432', name: 'Fatou Sow', online: true },
    { id: 'M-11890', name: 'Omar Ndiaye', online: false, lastSeen: '1 day ago' },
    { id: 'M-12001', name: 'Aissatou Ba', online: true },
  ];

  const [conversations, setConversations] = useState<Record<string, Message[]>>({
    'M-10234': [
      {
        id: '1',
        senderId: 'M-10234',
        senderName: 'Marie Dupont',
        content: 'Hi! Do you know which pharmacies accept our member discount?',
        timestamp: '10:30 AM',
        encrypted: true,
      },
      {
        id: '2',
        senderId: currentUserId,
        senderName: 'You',
        content: 'Yes! Pharmacie Centrale and Pharmacie du Plateau both do. You get 15% off.',
        timestamp: '10:32 AM',
        encrypted: true,
      },
      {
        id: '3',
        senderId: 'M-10234',
        senderName: 'Marie Dupont',
        content: 'Perfect, thank you so much! 🙏',
        timestamp: '10:35 AM',
        encrypted: true,
      },
    ],
    'M-11432': [
      {
        id: '1',
        senderId: 'M-11432',
        senderName: 'Fatou Sow',
        content: 'Hey, I just submitted a claim. How long does it usually take?',
        timestamp: 'Yesterday',
        encrypted: true,
      },
      {
        id: '2',
        senderId: currentUserId,
        senderName: 'You',
        content: 'If your trust score is above 75, it\'s approved instantly. Otherwise 24-48 hours.',
        timestamp: 'Yesterday',
        encrypted: true,
      },
    ],
  });

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedMember) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: 'You',
      content: messageInput,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      encrypted: true,
    };

    setConversations({
      ...conversations,
      [selectedMember.id]: [
        ...(conversations[selectedMember.id] || []),
        newMessage,
      ],
    });

    setMessageInput('');
  };

  const filteredMembers = groupMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Members Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => navigate('/app')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Group Chat</h2>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-indigo-600 focus:ring-0"
            />
          </div>
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {filteredMembers.map((member) => {
              const lastMessage = conversations[member.id]?.[conversations[member.id]?.length - 1];
              const isSelected = selectedMember?.id === member.id;
              
              return (
                <button
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg mb-1 transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 border-2 border-indigo-200'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-indigo-600" />
                    </div>
                    {member.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium text-gray-900 truncate">{member.name}</p>
                    {lastMessage ? (
                      <p className="text-xs text-gray-500 truncate">{lastMessage.content}</p>
                    ) : (
                      <p className="text-xs text-gray-400">No messages yet</p>
                    )}
                  </div>
                  {lastMessage && (
                    <span className="text-xs text-gray-400">{lastMessage.timestamp}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Encryption Notice */}
        <div className="p-4 border-t border-gray-200 bg-blue-50">
          <div className="flex items-center gap-2 text-blue-900">
            <Lock className="w-4 h-4" />
            <p className="text-xs font-medium">End-to-end encrypted</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedMember ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-gray-200 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  {selectedMember.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedMember.name}</p>
                  <p className="text-xs text-gray-500">
                    {selectedMember.online ? 'Online' : `Last seen ${selectedMember.lastSeen}`}
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {(conversations[selectedMember.id] || []).map((message) => {
                const isOwn = message.senderId === currentUserId;
                
                return (
                  <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                      {!isOwn && (
                        <p className="text-xs text-gray-500 mb-1 px-4">{message.senderName}</p>
                      )}
                      <div className={`rounded-2xl px-4 py-3 ${
                        isOwn
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className={`text-xs ${isOwn ? 'text-indigo-200' : 'text-gray-400'}`}>
                            {message.timestamp}
                          </p>
                          {message.encrypted && (
                            <Lock className={`w-3 h-3 ${isOwn ? 'text-indigo-200' : 'text-gray-400'}`} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-0"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Messages are end-to-end encrypted
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a Member to Chat
              </h3>
              <p className="text-sm text-gray-600">
                Choose a group member from the list to start a private conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
