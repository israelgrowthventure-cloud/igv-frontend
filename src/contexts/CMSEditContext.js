import React, { createContext, useContext } from 'react';

/**
 * Context pour l'édition CMS
 * Permet aux composants de page de savoir s'ils sont en mode édition
 */
export const CMSEditContext = createContext({
  isEditing: false,
  cmsContent: {},
  onContentChange: () => {},
  registerEditableField: () => {},
});

export const useCMSEdit = () => useContext(CMSEditContext);

/**
 * Hook pour rendre un élément éditable dans le CMS
 * Usage: <h1 {...useEditableField('hero_title', defaultValue)}>Titre</h1>
 */
export const useEditableField = (key, defaultValue = '') => {
  const { isEditing, cmsContent, onContentChange } = useCMSEdit();
  
  const value = cmsContent[key] !== undefined ? cmsContent[key] : defaultValue;
  
  if (!isEditing) {
    return { children: value };
  }
  
  return {
    'data-cms-key': key,
    'contentEditable': true,
    'suppressContentEditableWarning': true,
    'className': 'cms-editable-field',
    'onBlur': (e) => {
      const newValue = e.currentTarget.textContent;
      if (newValue !== value) {
        onContentChange(key, newValue);
      }
    },
    'onClick': (e) => {
      e.stopPropagation();
    },
    children: value,
  };
};

/**
 * Provider CMS Edit - Wrappe une page pour la rendre éditable
 */
export const CMSEditProvider = ({ isEditing, cmsContent, onContentChange, children }) => {
  return (
    <CMSEditContext.Provider value={{ isEditing, cmsContent, onContentChange }}>
      {children}
    </CMSEditContext.Provider>
  );
};
