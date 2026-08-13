import { useState, useEffect } from 'react';
import { Input, TextField, Label } from '@heroui/react';
import { useDebounce } from '../../hooks/useDebounce';

interface ArticleFiltersProps {
  author: string;
  title: string;
  content: string;
  onAuthorChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
}

export function ArticleFilters({
  author,
  title,
  content,
  onAuthorChange,
  onTitleChange,
  onContentChange,
}: ArticleFiltersProps) {
  const [filters, setFilters] = useState({ author, title, content });
  
  const debounced = useDebounce(filters, 500);

  useEffect(() => {
    setFilters({ author, title, content });
  }, [author, title, content]);

  useEffect(() => {
    if (debounced.author !== author) onAuthorChange(debounced.author);
    if (debounced.title !== title) onTitleChange(debounced.title);
    if (debounced.content !== content) onContentChange(debounced.content);
  }, [debounced]);

  const handleChange = (key: keyof typeof filters) => (value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full">
      <h2 className="mb-3 text-sm font-bold text-slate-800">
        Buscar artículos
      </h2>

      <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3">
        <TextField
          value={filters.author}
          onChange={handleChange('author')}
          className="w-full"
        >
          <Label>Autor</Label>
          <Input placeholder="Buscar por autor..." />
        </TextField>

        <TextField
          value={filters.title}
          onChange={handleChange('title')}
          className="w-full"
        >
          <Label>Título</Label>
          <Input placeholder="Buscar por título..." />
        </TextField>

        <TextField
          value={filters.content}
          onChange={handleChange('content')}
          className="w-full"
        >
          <Label>Contenido</Label>
          <Input placeholder="Palabras en el contenido..." />
        </TextField>
      </div>
    </div>
  );
}