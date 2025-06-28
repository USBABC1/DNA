/*
  # Initial Database Setup for DNA Analysis

  1. New Tables
    - `analysis_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `final_synthesis` (text, optional)
      - `status` (varchar, default 'in_progress')
    
    - `user_responses`
      - `id` (uuid, primary key)
      - `session_id` (uuid, references analysis_sessions)
      - `question_index` (integer)
      - `question_text` (text)
      - `transcript_text` (text)
      - `audio_file_drive_id` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create analysis_sessions table
CREATE TABLE IF NOT EXISTS analysis_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    final_synthesis TEXT,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'cancelled'))
);

-- Create user_responses table
CREATE TABLE IF NOT EXISTS user_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES analysis_sessions(id) ON DELETE CASCADE NOT NULL,
    question_index INTEGER NOT NULL,
    question_text TEXT,
    transcript_text TEXT,
    audio_file_drive_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(session_id, question_index)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analysis_sessions_user_id ON analysis_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_responses_session_id ON user_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_user_responses_question_index ON user_responses(session_id, question_index);

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for analysis_sessions
DROP TRIGGER IF EXISTS update_analysis_sessions_updated_at ON analysis_sessions;
CREATE TRIGGER update_analysis_sessions_updated_at 
    BEFORE UPDATE ON analysis_sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE analysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;

-- Policies for analysis_sessions
DROP POLICY IF EXISTS "Allow individual read access on analysis_sessions" ON analysis_sessions;
CREATE POLICY "Allow individual read access on analysis_sessions"
ON analysis_sessions FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow individual insert access on analysis_sessions" ON analysis_sessions;
CREATE POLICY "Allow individual insert access on analysis_sessions"
ON analysis_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow individual update access on analysis_sessions" ON analysis_sessions;
CREATE POLICY "Allow individual update access on analysis_sessions"
ON analysis_sessions FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policies for user_responses
DROP POLICY IF EXISTS "Allow individual read access on user_responses" ON user_responses;
CREATE POLICY "Allow individual read access on user_responses"
ON user_responses FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM analysis_sessions WHERE id = session_id));

DROP POLICY IF EXISTS "Allow individual insert access on user_responses" ON user_responses;
CREATE POLICY "Allow individual insert access on user_responses"
ON user_responses FOR INSERT 
WITH CHECK (auth.uid() = (SELECT user_id FROM analysis_sessions WHERE id = session_id));

DROP POLICY IF EXISTS "Allow individual update access on user_responses" ON user_responses;
CREATE POLICY "Allow individual update access on user_responses"
ON user_responses FOR UPDATE 
USING (auth.uid() = (SELECT user_id FROM analysis_sessions WHERE id = session_id))
WITH CHECK (auth.uid() = (SELECT user_id FROM analysis_sessions WHERE id = session_id));

-- Function to get session statistics
CREATE OR REPLACE FUNCTION get_session_stats(session_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'session_id', s.id,
        'total_questions', 10,
        'answered_questions', COUNT(r.id),
        'completion_percentage', (COUNT(r.id) * 100.0 / 10),
        'created_at', s.created_at,
        'updated_at', s.updated_at,
        'status', s.status
    )
    INTO result
    FROM analysis_sessions s
    LEFT JOIN user_responses r ON s.id = r.session_id
    WHERE s.id = session_uuid
    AND s.user_id = auth.uid()
    GROUP BY s.id, s.created_at, s.updated_at, s.status;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create analysis questions reference table
CREATE TABLE IF NOT EXISTS analysis_questions (
    id SERIAL PRIMARY KEY,
    question_index INTEGER NOT NULL UNIQUE,
    question_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert the 10 analysis questions
INSERT INTO analysis_questions (question_index, question_text) VALUES
(0, 'Conte-me sobre um momento em sua vida que você considera um ponto de virada significativo. O que aconteceu e como isso mudou você?'),
(1, 'Descreva uma situação em que você teve que tomar uma decisão muito difícil. Como você chegou à sua escolha e o que aprendeu sobre si mesmo?'),
(2, 'Fale sobre uma pessoa que teve grande influência em sua vida. Como ela impactou seus valores e perspectivas?'),
(3, 'Relate uma experiência em que você enfrentou um grande desafio ou obstáculo. Como você lidou com isso e o que descobriu sobre sua resiliência?'),
(4, 'Conte sobre um momento em que você se sentiu mais autêntico e verdadeiro consigo mesmo. O que estava acontecendo e por que foi significativo?'),
(5, 'Descreva uma situação em que seus valores foram testados ou questionados. Como você reagiu e o que isso revelou sobre suas convicções?'),
(6, 'Fale sobre um sonho ou objetivo que você tem para o futuro. Por que é importante para você e como pretende alcançá-lo?'),
(7, 'Relate uma experiência de perda ou luto que marcou sua vida. Como você processou essa experiência e o que ela ensinou sobre você?'),
(8, 'Conte sobre um momento em que você teve que perdoar alguém ou a si mesmo. Como foi esse processo e o que aprendeu sobre perdão?'),
(9, 'Descreva como você vê seu propósito de vida atualmente. Como essa visão evoluiu ao longo do tempo?')
ON CONFLICT (question_index) DO NOTHING;