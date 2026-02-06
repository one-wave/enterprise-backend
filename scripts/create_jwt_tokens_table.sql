-- JWT 토큰 저장용 테이블
-- psql 등에서 이 스크립트를 실행해서 테이블을 만들어주세요.

CREATE TABLE IF NOT EXISTS jwt_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_type TEXT NOT NULL,          -- 'company', 'jobseeker' 등
  auth_code TEXT NOT NULL,          -- 기업 로그인용 인증코드
  token TEXT NOT NULL,              -- JWT 문자열
  expires_at TIMESTAMPTZ NOT NULL,  -- 만료 시각
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

