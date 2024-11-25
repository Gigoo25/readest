import { useReaderStore } from '@/store/readerStore';
import { useNotebookStore } from '@/store/notebookStore';
import useShortcuts from '@/hooks/useShortcuts';
import useBooksManager from './useBooksManager';
import { useSidebarStore } from '@/store/sidebarStore';

interface UseBookShortcutsProps {
  sideBarBookKey: string | null;
  bookKeys: string[];
}

const useBookShortcuts = ({ sideBarBookKey, bookKeys }: UseBookShortcutsProps) => {
  const { getView, getViewSettings } = useReaderStore();
  const { toggleSideBar, setSideBarBookKey } = useSidebarStore();
  const { toggleNotebook } = useNotebookStore();
  const { getNextBookKey, openParallelView } = useBooksManager();
  const viewSettings = getViewSettings(sideBarBookKey ?? '');
  const fontSize = viewSettings?.defaultFontSize ?? 16;
  const lineHeight = viewSettings?.lineHeight ?? 1.6;
  const distance = fontSize * lineHeight * 3;

  const switchSideBar = () => {
    if (sideBarBookKey) setSideBarBookKey(getNextBookKey(sideBarBookKey));
  };

  const goLeft = () => {
    getView(sideBarBookKey)?.goLeft();
  };

  const goRight = () => {
    getView(sideBarBookKey)?.goRight();
  };

  const goPrev = () => {
    getView(sideBarBookKey)?.prev(distance);
  };

  const goNext = () => {
    getView(sideBarBookKey)?.next(distance);
  };

  const reloadPage = () => {
    window.location.reload();
  };

  useShortcuts(
    {
      onOpenParallelView: openParallelView,
      onSwitchSideBar: switchSideBar,
      onToggleSideBar: toggleSideBar,
      onToggleNotebook: toggleNotebook,
      onReloadPage: reloadPage,
      onGoLeft: goLeft,
      onGoRight: goRight,
      onGoPrev: goPrev,
      onGoNext: goNext,
    },
    [sideBarBookKey, bookKeys],
  );
};

export default useBookShortcuts;
