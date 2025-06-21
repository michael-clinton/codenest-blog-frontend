import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArchiveContent from '../components/ArchiveContent';

const archivePage = () => {
  return (
    <div>
      <Header />
      <ArchiveContent />
      <Footer />
    </div>
  )
}

export default archivePage;
