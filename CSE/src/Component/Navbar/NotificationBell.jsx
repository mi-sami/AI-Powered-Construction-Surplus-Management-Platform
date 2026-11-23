import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { handleApiAction } from '../../Utils/ApiHandler';

const NotificationBell = ({ userId }) => {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // handleApiAction দিয়ে লগইন করা ইউজারের নোটিফিকেশন লোড করা
  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const allNotifs = await handleApiAction({
          action: 'GET',
          target: 'notifications',
        });

        const list = Array.isArray(allNotifs) ? allNotifs : [];
        const userNotifs = list
          .filter(
            (n) =>
              String(n.userId) === String(userId) ||
              String(n.recipientId) === String(userId)
          )
          .reverse();

        setNotifications(userNotifs);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  // ড্রপডাউনের বাইরে ক্লিক করলে বন্ধ হয়ে যাবে
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // একটি নোটিফিকেশনে ক্লিক করলে Read মার্ক হবে এবং পেজে নেভিগেট করবে
  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await handleApiAction({
          action: 'EDIT',
          target: 'notifications',
          payload: { id: notif.id, isRead: true },
        });
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
      } catch (err) {
        console.error(err);
      }
    }
    setIsNotifOpen(false);
    if (notif.orderId) {
      navigate(`/receipt/${notif.orderId}`);
    } else {
      navigate('/dashboard');
    }
  };

  // সবগুলো একসাথে Read মার্ক করা
  const handleMarkAllRead = async () => {
    const unreadList = notifications.filter((n) => !n.isRead);
    try {
      await Promise.all(
        unreadList.map((n) =>
          handleApiAction({
            action: 'EDIT',
            target: 'notifications',
            payload: { id: n.id, isRead: true },
          })
        )
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const dateLocale = i18n.language?.startsWith('bn') ? 'bn-BD' : 'en-US';

  return (
    <div className="relative" ref={notifRef}>
      <button
        type="button"
        onClick={() => setIsNotifOpen((prev) => !prev)}
        aria-label={t('notifications.ariaLabel')}
        className="relative p-2 text-gray-300 hover:text-white bg-[#252b33] hover:bg-[#2f3640] rounded-full transition cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#c24e00] rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isNotifOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#252b33] border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-50">
          <div className="px-4 py-3 bg-[#1e232a] border-b border-gray-700 flex items-center justify-between">
            <span className="text-sm font-semibold text-white">
              {t('notifications.header', { count: unreadCount })}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-[#008ba9] hover:underline cursor-pointer"
              >
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-700/70">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400">
                {t('notifications.empty')}
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 cursor-pointer transition hover:bg-[#2e353f] ${
                    !notif.isRead ? 'bg-[#1e232a]/80' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-white">
                      {notif.title}
                    </p>
                    {!notif.isRead && (
                      <span className="w-2 h-2 mt-1 rounded-full bg-[#008ba9] shrink-0"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1.5">
                    {new Date(notif.createdAt).toLocaleString(dateLocale)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;