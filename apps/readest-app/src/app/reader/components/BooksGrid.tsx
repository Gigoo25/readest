import React from 'react';

import { useSettingsStore } from '@/store/settingsStore';
import { useReaderStore } from '@/store/readerStore';
import FoliateViewer from './FoliateViewer';
import getGridTemplate from '@/utils/grid';
import SectionInfo from './SectionInfo';
import HeaderBar from './HeaderBar';
import FooterBar from './FooterBar';
import PageInfoView from './PageInfo';
import Ribbon from './Ribbon';
import SettingsDialog from './settings/SettingsDialog';
import Annotator from './annotator/Annotator';
import { useBookDataStore } from '@/store/bookDataStore';

interface BooksGridProps {
  bookKeys: string[];
  onCloseBook: (bookKey: string) => void;
}

const BooksGrid: React.FC<BooksGridProps> = ({ bookKeys, onCloseBook }) => {
  const { getConfig, getBookData } = useBookDataStore();
  const { getProgress, getViewState, getViewSettings } = useReaderStore();
  const { isFontLayoutSettingsDialogOpen, setFontLayoutSettingsDialogOpen } = useSettingsStore();
  const gridTemplate = getGridTemplate(bookKeys.length, window.innerWidth / window.innerHeight);

  return (
    <div
      className='grid h-full flex-grow'
      style={{
        gridTemplateColumns: gridTemplate.columns,
        gridTemplateRows: gridTemplate.rows,
      }}
    >
      {bookKeys.map((bookKey, index) => {
        const bookData = getBookData(bookKey);
        const config = getConfig(bookKey);
        const progress = getProgress(bookKey);
        const viewSettings = getViewSettings(bookKey);
        const { book, bookDoc } = bookData || {};
        if (!book || !config || !bookDoc || !viewSettings) return null;

        const { section, pageinfo, sectionLabel } = progress || {};
        const isBookmarked = getViewState(bookKey)?.ribbonVisible;
        const marginGap = `${viewSettings.gapPercent}%`;

        return (
          <div
            id={`gridcell-${bookKey}`}
            key={bookKey}
            className='relative h-full w-full overflow-hidden'
          >
            {isBookmarked && <Ribbon width={marginGap} />}
            <HeaderBar
              bookKey={bookKey}
              bookTitle={book.title}
              isTopLeft={index === 0}
              isHoveredAnim={bookKeys.length > 2}
              onCloseBook={onCloseBook}
              onSetSettingsDialogOpen={setFontLayoutSettingsDialogOpen}
            />
            <FoliateViewer bookKey={bookKey} bookDoc={bookDoc} config={config} />
            {viewSettings.scrolled ? null : (
              <>
                <SectionInfo section={sectionLabel} gapLeft={marginGap} />
                <PageInfoView
                  bookFormat={book.format}
                  section={section ?? null}
                  pageinfo={pageinfo ?? null}
                  gapRight={marginGap}
                />
              </>
            )}
            <Annotator bookKey={bookKey} />
            <FooterBar bookKey={bookKey} pageinfo={pageinfo} isHoveredAnim={false} />
            {isFontLayoutSettingsDialogOpen && <SettingsDialog bookKey={bookKey} config={config} />}
          </div>
        );
      })}
    </div>
  );
};

export default BooksGrid;
