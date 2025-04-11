import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/db';

const MoodboardContext = createContext();

export const useMoodboard = () => useContext(MoodboardContext);

export const MoodboardProvider = ({ children }) => {
  const [moodboards, setMoodboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load moodboards from IndexedDB
  useEffect(() => {
    const loadMoodboards = async () => {
      try {
        const loadedMoodboards = await db.moodboards.toArray();
        setMoodboards(loadedMoodboards);
        setLoading(false);
      } catch (err) {
        console.error('Error loading moodboards:', err);
        setError('Failed to load moodboards');
        setLoading(false);
      }
    };

    loadMoodboards();
  }, []);

  // Create a new moodboard
  const createMoodboard = async (name) => {
    try {
      const now = new Date();
      const newMoodboard = {
        id: uuidv4(),
        name,
        thumbnail: null,
        createdAt: now,
        updatedAt: now
      };
      
      await db.moodboards.add(newMoodboard);
      setMoodboards([...moodboards, newMoodboard]);
      return newMoodboard.id;
    } catch (err) {
      console.error('Error creating moodboard:', err);
      setError('Failed to create moodboard');
      return null;
    }
  };

  // Get a specific moodboard by ID
  const getMoodboard = async (id) => {
    try {
      return await db.moodboards.get(id);
    } catch (err) {
      console.error('Error getting moodboard:', err);
      setError('Failed to get moodboard');
      return null;
    }
  };

  // Update a moodboard
  const updateMoodboard = async (id, updates) => {
    try {
      updates.updatedAt = new Date();
      await db.moodboards.update(id, updates);
      setMoodboards(moodboards.map(mb => 
        mb.id === id ? { ...mb, ...updates } : mb
      ));
    } catch (err) {
      console.error('Error updating moodboard:', err);
      setError('Failed to update moodboard');
    }
  };

  // Delete a moodboard
  const deleteMoodboard = async (id) => {
    try {
      // Delete all sections and media items in this moodboard first
      const sections = await db.sections.where('moodboardId').equals(id).toArray();
      for (const section of sections) {
        await db.mediaItems.where('sectionId').equals(section.id).delete();
      }
      await db.sections.where('moodboardId').equals(id).delete();
      
      // Then delete the moodboard
      await db.moodboards.delete(id);
      setMoodboards(moodboards.filter(mb => mb.id !== id));
    } catch (err) {
      console.error('Error deleting moodboard:', err);
      setError('Failed to delete moodboard');
    }
  };

  // Create a new section in a moodboard
  const createSection = async (moodboardId, title, position) => {
    try {
      const now = new Date();
      const newSection = {
        id: uuidv4(),
        moodboardId,
        title,
        position,
        createdAt: now,
        updatedAt: now
      };
      
      await db.sections.add(newSection);
      return newSection.id;
    } catch (err) {
      console.error('Error creating section:', err);
      setError('Failed to create section');
      return null;
    }
  };

  // Get all sections for a moodboard
  const getSections = async (moodboardId) => {
    try {
      return await db.sections.where('moodboardId').equals(moodboardId).toArray();
    } catch (err) {
      console.error('Error getting sections:', err);
      setError('Failed to get sections');
      return [];
    }
  };

  // Update a section
  const updateSection = async (id, updates) => {
    try {
      updates.updatedAt = new Date();
      await db.sections.update(id, updates);
    } catch (err) {
      console.error('Error updating section:', err);
      setError('Failed to update section');
    }
  };

  // Delete a section
  const deleteSection = async (id) => {
    try {
      // Delete all media items in this section first
      await db.mediaItems.where('sectionId').equals(id).delete();
      
      // Then delete the section
      await db.sections.delete(id);
    } catch (err) {
      console.error('Error deleting section:', err);
      setError('Failed to delete section');
    }
  };

  // Add a media item to a section
  const addMediaItem = async (sectionId, type, content, src, position) => {
    try {
      const now = new Date();
      const newMediaItem = {
        id: uuidv4(),
        sectionId,
        type, // 'image', 'text', 'link', etc.
        content, // text content or metadata
        src, // URL or data URI for images
        position,
        createdAt: now,
        updatedAt: now
      };
      
      await db.mediaItems.add(newMediaItem);
      return newMediaItem.id;
    } catch (err) {
      console.error('Error adding media item:', err);
      setError('Failed to add media item');
      return null;
    }
  };

  // Get all media items for a section
  const getMediaItems = async (sectionId) => {
    try {
      return await db.mediaItems.where('sectionId').equals(sectionId).toArray();
    } catch (err) {
      console.error('Error getting media items:', err);
      setError('Failed to get media items');
      return [];
    }
  };

  // Update a media item
  const updateMediaItem = async (id, updates) => {
    try {
      updates.updatedAt = new Date();
      await db.mediaItems.update(id, updates);
    } catch (err) {
      console.error('Error updating media item:', err);
      setError('Failed to update media item');
    }
  };

  // Delete a media item
  const deleteMediaItem = async (id) => {
    try {
      await db.mediaItems.delete(id);
    } catch (err) {
      console.error('Error deleting media item:', err);
      setError('Failed to delete media item');
    }
  };

  // Import pins from Pinterest
  const importFromPinterest = async (moodboardId, sectionId, pinterestData) => {
    // This would require Pinterest API integration
    // For now, we'll just set up the structure
    setError('Pinterest integration is not yet implemented');
  };

  const value = {
    moodboards,
    loading,
    error,
    createMoodboard,
    getMoodboard,
    updateMoodboard,
    deleteMoodboard,
    createSection,
    getSections,
    updateSection,
    deleteSection,
    addMediaItem,
    getMediaItems,
    updateMediaItem,
    deleteMediaItem,
    importFromPinterest
  };

  return (
    <MoodboardContext.Provider value={value}>
      {children}
    </MoodboardContext.Provider>
  );
};
