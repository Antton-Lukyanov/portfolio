// Фильтрация проектов, модальные окна и переключатель тем
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация темы
    initializeTheme();
    
    // Фильтры на странице проектов
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-full-card');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Обновляем активную кнопку
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Фильтруем проекты
                projectCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Модальные окна для проектов
    const projectCardsClickable = document.querySelectorAll('.project-full-card, .project-card');
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalProjectTitle');
    const modalBody = document.getElementById('modalProjectBody');
    const modalClose = document.querySelector('.modal-close');
    
    if (modal) {
        // Открытие модального окна
        projectCardsClickable.forEach(card => {
            card.addEventListener('click', function() {
                const title = this.querySelector('.project-full-title, .project-title').textContent;
                const tech = this.querySelector('.project-full-tech')?.textContent || '';
                const desc = this.querySelector('.project-full-desc')?.textContent || '';
                
                modalTitle.textContent = title;
                modalBody.innerHTML = `
                    <div class="modal-development">
                        <div class="modal-development-icon">🚧</div>
                        <h3>Страница в разработке</h3>
                        <p>Детальная информация о проекте скоро появится здесь!</p>
                        <div style="margin-top: 20px; padding: 15px; background: var(--bg-light); border-radius: 8px;">
                            <h4>Планируемое содержимое:</h4>
                            <ul style="text-align: left; margin-top: 10px;">
                                <li>Полное описание проекта</li>
                                <li>Скриншоты и демонстрации</li>
                                <li>Ссылки на живую версию</li>
                                <li>Исходный код на GitHub</li>
                                <li>Используемые технологии</li>
                            </ul>
                        </div>
                        ${tech ? `<p><strong>Технологии:</strong> ${tech}</p>` : ''}
                        ${desc ? `<p><strong>Описание:</strong> ${desc}</p>` : ''}
                    </div>
                `;
                modal.style.display = 'block';
            });
        });
        
        // Закрытие модального окна
        modalClose.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Обработка формы контактов
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Простая валидация
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (name && email && message) {
                // В реальном приложении здесь был бы AJAX запрос
                alert('Спасибо! Ваше сообщение отправлено. Я свяжусь с вами в ближайшее время.');
                contactForm.reset();
            }
        });
    }
    
    // Добавление записи в дневник
    const addEntryBtn = document.getElementById('addEntryBtn');
    if (addEntryBtn) {
        addEntryBtn.addEventListener('click', function() {
            const title = prompt('Введите заголовок записи:');
            if (title) {
                const description = prompt('Введите описание:');
                if (description) {
                    alert('Запись добавлена! В реальном приложении здесь была бы база данных.');
                }
            }
        });
    }
    
    // Инициализация круговых прогресс-баров
    initializeSkillCircles();
});

// Функция для инициализации круговых прогресс-баров
function initializeSkillCircles() {
    const skillCircles = document.querySelectorAll('.skill-circle');
    
    skillCircles.forEach(circle => {
        const percent = circle.getAttribute('data-percent');
        circle.style.setProperty('--p', percent + '%');
    });
}

// Функция для инициализации и переключения темы
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    // Проверяем сохранённую тему или системные настройки
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Светлая';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Тёмная';
    }
    
    // Обработчик переключения темы
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            
            if (currentTheme === 'light') {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeIcon.textContent = '☀️';
                themeText.textContent = 'Светлая';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeIcon.textContent = '🌙';
                themeText.textContent = 'Тёмная';
            }
        });
    }
}