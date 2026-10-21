from fastapi import HTTPException,Depends,status,APIRouter,Response,Request
from .. import models,utils,schemas,oauth
from ..database import get_db
from sqlalchemy.orm import Session
from ..config import settings

router = APIRouter(
    tags= ["Authentication"],
    prefix="/auth"
)

@router.post("/login")
async def login_user(
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        body = await request.json()
        email_or_username = body.get("email") or body.get("username")
        password = body.get("password")
    else:
        form = await request.form()
        email_or_username = form.get("username") or form.get("email")
        password = form.get("password")

    if not email_or_username or not password:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Email/username and password are required"
        )

    check_user = db.query(models.Users).filter(
        (models.Users.email == email_or_username) | (models.Users.username == email_or_username)
    ).first()
    if not check_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")

    verify_password = utils.verify_password(password, check_user.password)
    if not verify_password:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")

    access_token = oauth.create_token(data={"owner_id": check_user.id})

    # Cross-site cookie requires SameSite="none" and Secure=True in production over HTTPS
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=True,
        samesite="none",
        max_age=settings.access_token_expire_minutes * 60
    )

    return {
        "message": "Login successful",
        "user": {
            "id": check_user.id,
            "username": check_user.username,
            "email": check_user.email,
            "is_admin": check_user.is_admin
        }
    }


@router.post("/logout")
@router.post("")
@router.post("/")
def logout_user(response: Response):
    response.set_cookie(
        key="access_token",
        value="",
        httponly=True,
        secure=True,
        samesite="none",
        max_age=0
    )
    return {"message": "Logout successful"}


@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.Users = Depends(oauth.get_current_user)):
    return current_user
