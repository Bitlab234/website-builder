CREATE TABLE IF NOT EXISTS templates (
    id VARCHAR(10) PRIMARY KEY,
    keywords TEXT,
    name VARCHAR(100),
    description TEXT,
    author VARCHAR(100),
    license VARCHAR(50),
    price VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS template_blocks (
    id SERIAL PRIMARY KEY,
    template_id VARCHAR(10) REFERENCES templates(id) ON DELETE CASCADE,
    type VARCHAR(50),
    component VARCHAR(50),
    position INT
);

CREATE TABLE IF NOT EXISTS landings (
    id VARCHAR(10) PRIMARY KEY,
    template_id VARCHAR(10) REFERENCES templates(id)
);

CREATE TABLE IF NOT EXISTS landing_blocks (
    id SERIAL PRIMARY KEY,
    landing_id VARCHAR(10) REFERENCES landings(id) ON DELETE CASCADE,
    type VARCHAR(50),
    component VARCHAR(50),
    position INT
);

INSERT INTO templates (id, keywords, name, description, author, license, price) VALUES
('1', 'Ввод текста, Ввод картинки, Компонент', 'Шаблон 1', 'Описание шаблона 1', 'Автор 1', 'MIT', '1000'),
('2', 'Ввод текста, Компонент', 'Шаблон 2', 'Описание шаблона 2', 'Автор 2', 'GPL', '1500'),
('3', 'Ввод картинки, Компонент', 'Шаблон 3', 'Описание шаблона 3', 'Автор 3', 'MIT', '1200'),
('4', 'Компонент', 'Шаблон 4', 'Описание шаблона 4', 'Автор 4', 'GPL', '1500');

INSERT INTO template_blocks (template_id, type, component, position) VALUES
('1', 'header', 'Header1', 1),
('1', 'main not input', 'Main1_1', 2),
('1', 'main text input', 'Main1_2', 3),
('1', 'main image input', 'Main1_3', 4),
('1', 'footer', 'Footer1', 5),
('2', 'header', 'Header2', 1),
('2', 'main not input', 'Main2_1', 2),
('2', 'main text input', 'Main2_2', 3),
('2', 'main not input', 'Main2_3', 4),
('2', 'footer', 'Footer2', 5),
('3', 'header', 'Header3', 1),
('3', 'main image input', 'Main3_1', 2),
('3', 'main not input', 'Main3_2', 3),
('3', 'footer', 'Footer3', 4),
('4', 'header', 'Header4', 1),
('4', 'main not input', 'Main4_1', 2),
('4', 'main not input', 'Main4_2', 3),
('4', 'main not input', 'Main4_3', 4),
('4', 'footer', 'Footer4', 5);

INSERT INTO landings (id, template_id) VALUES
('68da', '4'),
('a67b', '1');

INSERT INTO landing_blocks (landing_id, type, component, position) VALUES
('68da', 'header', 'Header4', 1),
('68da', 'main not input', 'Main4_1', 2),
('68da', 'main not input', 'Main4_2', 3),
('68da', 'main not input', 'Main4_3', 4),
('68da', 'footer', 'Footer4', 5),
('a67b', 'header', 'Header1', 1),
('a67b', 'main text input', 'Main1_2', 2),
('a67b', 'main image input', 'Main1_3', 3),
('a67b', 'footer', 'Footer1', 4);