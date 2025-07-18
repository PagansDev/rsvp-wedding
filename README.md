# RSVP Wedding- Setup & Authentication

This project uses Nuxt 3, Pinia, Supabase, and Google OAuth authentication for the admin area.

## Requirements

- Node.js 18+
- [Supabase](https://supabase.com/) account
- Google account for authentication

## Database Setup (Supabase)

1. Create a new project in Supabase.
2. Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY` from the project settings.
3. In the Supabase SQL editor, create the required tables:

```sql
-- Event table
CREATE TABLE public.event (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying,
  event_date timestamp with time zone,
  invite_text text,
  message text,
  adress_1 text,
  adress_2 text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT event_pkey PRIMARY KEY (id)
);

-- Gift table
CREATE TABLE public.gift (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone,
  external_reference character varying,
  name character varying,
  is_available boolean NOT NULL DEFAULT true,
  image_url character varying,
  price character varying,
  payment_url character varying,
  quantity numeric DEFAULT '1'::numeric,
  quantity_gifted numeric DEFAULT '0'::numeric,
  CONSTRAINT gift_pkey PRIMARY KEY (id)
);

-- RSVP table
CREATE TABLE public.rsvp (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  name character varying,
  has_guest boolean NOT NULL DEFAULT false,
  guest_name character varying,
  whatsapp character varying NOT NULL,
  document character varying NOT NULL,
  guest_document character varying,
  CONSTRAINT rsvp_pkey PRIMARY KEY (id)
);

-- Test table
CREATE TABLE public.test (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name character varying DEFAULT 'teste'::character varying,
  CONSTRAINT test_pkey PRIMARY KEY (id)
);

-- Users table
CREATE TABLE public.users (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  user character varying NOT NULL UNIQUE,
  password character varying,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
```

4. Enable Google OAuth in Supabase Authentication > Providers > Google.
5. Add authorized redirect URLs in Authentication > Site URLs:
   - `http://<your-local-ip>:3000/auth/callback` or your production url

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Authorized Emails (comma-separated, no spaces)
AUTHORIZED_EMAILS=paulogabrielneves96@gmail.com,isabelemendes34@gmail.com
```

## Running the Project

```bash
npm run dev
```

Access at `http://localhost:3000` or your configured IP.

## Authentication Flow

1. Go to `/login` and click "Sign in with Google".
2. Only emails listed in `AUTHORIZED_EMAILS` will have access to the admin area.
3. If the email is not authorized, the user will be automatically logged out and see an error message.
4. Access to `/admin` and `/test` is protected by authentication and authorization.

## Security

- Authorized emails are only in `.env` (not versioned in GitHub).
- The authentication token is saved in localStorage and validated on every access.
- Logout is available via the button in the admin panel.

## Production

To build and preview for production:

```bash
npm run build
npm run preview
```

For deployment, follow the [official Nuxt documentation](https://nuxt.com/docs/getting-started/deployment).
